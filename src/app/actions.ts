"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readData, update, newId, type Task, type User } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { endSession, requireUser, startSession } from "@/lib/auth";
import { maskContactDetails, round2 } from "@/lib/format";

/* ---------- helpers ---------- */

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

/** Send the user back to `path` with an error message in the query string. */
function fail(path: string, message: string): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}error=${encodeURIComponent(message)}`);
}

function safeNext(next: string, fallback: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

/* ---------- accounts ---------- */

export async function signUp(formData: FormData) {
  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");
  const suburb = str(formData, "suburb");

  if (!name) fail("/auth/signup", "Please enter your name.");
  if (!/^\S+@\S+\.\S+$/.test(email)) fail("/auth/signup", "Please enter a valid email address.");
  if (password.length < 8) fail("/auth/signup", "Password must be at least 8 characters.");

  const user = update((d) => {
    if (d.users.some((u) => u.email === email)) return null;
    const created: User = {
      id: newId("u"),
      name,
      email,
      passwordHash: hashPassword(password),
      suburb: suburb || "Melbourne",
      bio: "",
      skills: [],
      phoneVerified: false,
      createdAt: new Date().toISOString(),
    };
    d.users.push(created);
    return created;
  });

  if (!user) fail("/auth/signup", "An account with that email already exists.");
  await startSession(user.id);
  redirect("/dashboard?welcome=1");
}

export async function logIn(formData: FormData) {
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");
  const next = safeNext(str(formData, "next"), "/dashboard");

  const user = readData().users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    fail(`/auth/login?next=${encodeURIComponent(next)}`, "Incorrect email or password.");
  }
  await startSession(user.id);
  redirect(next);
}

export async function logOut() {
  await endSession();
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser("/settings");
  const name = str(formData, "name");
  const suburb = str(formData, "suburb");
  const bio = str(formData, "bio").slice(0, 500);
  const skills = str(formData, "skills")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);

  if (!name) fail("/settings", "Name can't be empty.");

  update((d) => {
    const u = d.users.find((x) => x.id === user.id);
    if (!u) return;
    u.name = name;
    u.suburb = suburb;
    u.bio = bio;
    u.skills = skills;
  });
  redirect("/settings?saved=1");
}

/** Demo stand-in for SMS verification. A real build calls an SMS provider here. */
export async function verifyPhoneDemo() {
  const user = await requireUser("/settings");
  update((d) => {
    const u = d.users.find((x) => x.id === user.id);
    if (u) u.phoneVerified = true;
  });
  redirect("/settings?saved=1");
}

/* ---------- tasks ---------- */

export async function createTask(formData: FormData) {
  const user = await requireUser("/tasks/new");
  const title = str(formData, "title");
  const description = str(formData, "description");
  const categoryId = str(formData, "categoryId");
  const mode = str(formData, "mode");
  const suburb = str(formData, "suburb");
  const budgetType = str(formData, "budgetType");
  const budgetRaw = str(formData, "budget");
  const dueDate = str(formData, "dueDate");

  const back = "/tasks/new";
  if (title.length < 5) fail(back, "Title should be at least 5 characters.");
  if (description.length < 20) fail(back, "Describe the task in at least 20 characters.");
  if (!readData().categories.some((c) => c.id === categoryId)) fail(back, "Choose a category.");
  if (mode !== "in-person" && mode !== "remote") fail(back, "Choose in-person or remote.");
  if (mode === "in-person" && !suburb) fail(back, "Add a suburb for in-person tasks.");
  if (budgetType !== "fixed" && budgetType !== "hourly" && budgetType !== "open") {
    fail(back, "Choose a budget type.");
  }

  let budget: number | null = null;
  if (budgetType !== "open") {
    budget = Number(budgetRaw);
    if (!Number.isFinite(budget) || budget <= 0) {
      fail(back, 'Enter a budget above $0, or choose "open to offers".');
    }
    budget = round2(budget);
  }

  const task = update((d) => {
    const created: Task = {
      id: newId("t"),
      posterId: user.id,
      title,
      description,
      categoryId,
      mode,
      suburb: mode === "remote" ? "Remote" : suburb,
      budgetType,
      budget,
      dueDate: dueDate || null,
      status: "open",
      hiredTaskerId: null,
      agreedPrice: null,
      escrow: "none",
      workDoneAt: null,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    d.tasks.push(created);
    return created;
  });

  redirect(`/tasks/${task.id}?posted=1`);
}

export async function cancelTask(formData: FormData) {
  const taskId = str(formData, "taskId");
  const user = await requireUser(`/tasks/${taskId}`);
  const back = `/tasks/${taskId}`;

  const err = update((d) => {
    const task = d.tasks.find((t) => t.id === taskId);
    if (!task || task.posterId !== user.id) return "Only the poster can cancel this task.";
    if (task.status !== "open") return "Only open tasks can be cancelled.";
    task.status = "cancelled";
    return null;
  });
  if (err) fail(back, err);
  redirect(`${back}?cancelled=1`);
}

/* ---------- offers ---------- */

export async function makeOffer(formData: FormData) {
  const taskId = str(formData, "taskId");
  const user = await requireUser(`/tasks/${taskId}`);
  const back = `/tasks/${taskId}`;
  const price = round2(Number(str(formData, "price")));
  const message = maskContactDetails(str(formData, "message"));
  const availability = str(formData, "availability") || "Flexible";

  const err = update((d) => {
    const task = d.tasks.find((t) => t.id === taskId);
    if (!task || task.status !== "open") return "This task is no longer accepting offers.";
    if (task.posterId === user.id) return "You can't make an offer on your own task.";
    if (!Number.isFinite(price) || price <= 0) return "Enter a valid price.";
    if (message.length < 10) return "Add a short message (at least 10 characters) for the poster.";
    if (d.offers.some((o) => o.taskId === taskId && o.taskerId === user.id && o.status === "pending")) {
      return "You already have a pending offer on this task.";
    }
    d.offers.push({
      id: newId("o"),
      taskId,
      taskerId: user.id,
      price,
      message,
      availability,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return null;
  });
  if (err) fail(back, err);
  redirect(`${back}?offered=1`);
}

export async function acceptOffer(formData: FormData) {
  const taskId = str(formData, "taskId");
  const offerId = str(formData, "offerId");
  const user = await requireUser(`/tasks/${taskId}`);
  const back = `/tasks/${taskId}`;

  const err = update((d) => {
    const task = d.tasks.find((t) => t.id === taskId);
    if (!task || task.posterId !== user.id) return "Only the poster can accept offers.";
    if (task.status !== "open") return "This task has already been filled.";
    const offer = d.offers.find((o) => o.id === offerId && o.taskId === taskId && o.status === "pending");
    if (!offer) return "That offer is no longer available.";

    offer.status = "accepted";
    for (const o of d.offers) {
      if (o.taskId === taskId && o.id !== offerId && o.status === "pending") o.status = "declined";
    }
    task.status = "in_progress";
    task.hiredTaskerId = offer.taskerId;
    task.agreedPrice = offer.price;
    return null;
  });
  if (err) fail(back, err);
  redirect(`${back}?hired=1`);
}

/* ---------- payments (mocked) ---------- */

/** Demo payment: marks the agreed amount as held in escrow. No money moves. */
export async function fundEscrow(formData: FormData) {
  const taskId = str(formData, "taskId");
  const user = await requireUser(`/tasks/${taskId}`);
  const back = `/tasks/${taskId}`;

  const err = update((d) => {
    const task = d.tasks.find((t) => t.id === taskId);
    if (!task || task.posterId !== user.id) return "Only the poster can fund this task.";
    if (task.status !== "in_progress" || !task.hiredTaskerId) return "Hire a Tasker before funding.";
    if (task.escrow !== "none") return "This task is already funded.";
    task.escrow = "funded";
    return null;
  });
  if (err) fail(back, err);
  redirect(`${back}?funded=1`);
}

/** Poster confirms the work is done. Releases escrow and closes the task. */
export async function confirmCompletion(formData: FormData) {
  const taskId = str(formData, "taskId");
  const user = await requireUser(`/tasks/${taskId}`);
  const back = `/tasks/${taskId}`;

  const err = update((d) => {
    const task = d.tasks.find((t) => t.id === taskId);
    if (!task || task.posterId !== user.id) return "Only the poster can confirm completion.";
    if (task.status !== "in_progress") return "This task isn't in progress.";
    if (task.escrow !== "funded") return "Fund the task before confirming completion.";
    if (!task.workDoneAt) return "The Tasker hasn't marked the work as done yet.";
    task.escrow = "released";
    task.status = "completed";
    task.completedAt = new Date().toISOString();
    return null;
  });
  if (err) fail(back, err);
  redirect(`${back}?completed=1`);
}

export async function markWorkDone(formData: FormData) {
  const taskId = str(formData, "taskId");
  const user = await requireUser(`/tasks/${taskId}`);
  const back = `/tasks/${taskId}`;

  const err = update((d) => {
    const task = d.tasks.find((t) => t.id === taskId);
    if (!task || task.hiredTaskerId !== user.id) return "Only the hired Tasker can do this.";
    if (task.status !== "in_progress") return "This task isn't in progress.";
    task.workDoneAt = new Date().toISOString();
    return null;
  });
  if (err) fail(back, err);
  redirect(`${back}?done=1`);
}

/* ---------- chat ---------- */

export async function sendMessage(formData: FormData) {
  const taskId = str(formData, "taskId");
  const user = await requireUser(`/tasks/${taskId}`);
  const back = `/tasks/${taskId}`;
  const body = maskContactDetails(str(formData, "body")).slice(0, 1000);

  if (!body) redirect(back);

  const err = update((d) => {
    const task = d.tasks.find((t) => t.id === taskId);
    if (!task) return "Task not found.";
    const isParticipant = user.id === task.posterId || user.id === task.hiredTaskerId;
    if (!isParticipant) return "Chat opens once a Tasker is hired.";
    if (task.status !== "in_progress" && task.status !== "completed") return "Chat opens once a Tasker is hired.";
    d.messages.push({
      id: newId("m"),
      taskId,
      senderId: user.id,
      body,
      createdAt: new Date().toISOString(),
    });
    return null;
  });
  if (err) fail(back, err);
  // Refresh the cached page so the sender sees their own message straight away.
  revalidatePath(back);
  redirect(back);
}

/* ---------- reviews ---------- */

export async function leaveReview(formData: FormData) {
  const taskId = str(formData, "taskId");
  const user = await requireUser(`/tasks/${taskId}`);
  const back = `/tasks/${taskId}`;
  const rating = Number(str(formData, "rating"));
  const text = str(formData, "text").slice(0, 500);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) fail(back, "Choose a rating from 1 to 5.");

  const err = update((d) => {
    const task = d.tasks.find((t) => t.id === taskId);
    if (!task || task.status !== "completed") return "You can review once the task is completed.";
    let revieweeId: string | null = null;
    if (user.id === task.posterId && task.hiredTaskerId) revieweeId = task.hiredTaskerId;
    if (user.id === task.hiredTaskerId) revieweeId = task.posterId;
    if (!revieweeId) return "Only the poster or the hired Tasker can review this task.";
    if (d.reviews.some((r) => r.taskId === taskId && r.reviewerId === user.id)) {
      return "You've already reviewed this task.";
    }
    d.reviews.push({
      id: newId("r"),
      taskId,
      reviewerId: user.id,
      revieweeId,
      rating,
      text,
      createdAt: new Date().toISOString(),
    });
    return null;
  });
  if (err) fail(back, err);
  redirect(`${back}?reviewed=1`);
}
