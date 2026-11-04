import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readData } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import {
  acceptOffer,
  cancelTask,
  confirmCompletion,
  fundEscrow,
  leaveReview,
  makeOffer,
  markWorkDone,
  sendMessage,
} from "@/app/actions";
import {
  Avatar,
  BTN,
  BTN_DANGER,
  BTN_OUTLINE,
  CARD,
  Container,
  INPUT,
  LABEL,
  Notice,
  StatusBadge,
  Stars,
} from "@/components/ui";
import { budgetLabel, dateLabel, dateTimeLabel, money, payoutFor, SERVICE_FEE } from "@/lib/format";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const task = readData().tasks.find((t) => t.id === id);
  return { title: task ? task.title : "Task not found" };
}

export default async function TaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const d = readData();
  const task = d.tasks.find((t) => t.id === id);
  if (!task) notFound();

  const user = await getCurrentUser();
  const category = d.categories.find((c) => c.id === task.categoryId);
  const poster = d.users.find((u) => u.id === task.posterId)!;
  const hired = task.hiredTaskerId ? d.users.find((u) => u.id === task.hiredTaskerId) : undefined;

  const offers = d.offers
    .filter((o) => o.taskId === task.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const isPoster = user?.id === task.posterId;
  const isHired = !!user && user.id === task.hiredTaskerId;
  const myOffer = user ? offers.find((o) => o.taskerId === user.id) : undefined;
  const canSeeChat = (isPoster || isHired) && !!task.hiredTaskerId;

  const messages = canSeeChat
    ? d.messages
        .filter((m) => m.taskId === task.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    : [];
  const reviews = d.reviews.filter((r) => r.taskId === task.id);
  const myReview = user ? reviews.find((r) => r.reviewerId === user.id) : undefined;

  const notice = {
    error: first(sp.error),
    message: first(sp.posted)
      ? "Your task is live. Taskers can now send offers."
      : first(sp.offered)
        ? "Offer sent. The poster will be in touch."
        : first(sp.hired)
          ? "Tasker hired. Fund the task to start the work."
          : first(sp.funded)
            ? "Payment held in escrow. The Tasker can start."
            : first(sp.done)
              ? "Marked as done. The poster will confirm and release payment."
              : first(sp.completed)
                ? "Task completed and payment released. Please leave a review."
                : first(sp.reviewed)
                  ? "Thanks for your review."
                  : first(sp.cancelled)
                    ? "Task cancelled."
                    : undefined,
  };

  const hiredOffer = offers.find((o) => o.status === "accepted");
  // Offers are private: posters see all of them, Taskers see only their own.
  const visibleOffers = isPoster ? offers : offers.filter((o) => o.taskerId === user?.id);

  return (
    <Container>
      <nav className="mb-4 text-sm text-gray-600" aria-label="Breadcrumb">
        <Link href="/tasks" className="hover:text-teal-700">Browse tasks</Link>
        {category && <> / <Link href={`/tasks?category=${category.id}`} className="hover:text-teal-700">{category.name}</Link></>}
      </nav>

      <Notice {...notice} />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Task summary */}
          <section className={CARD}>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              {category && <span>{category.icon} {category.name}</span>}
              <span aria-hidden="true">·</span>
              <span>{task.mode === "remote" ? "Remote" : task.suburb}</span>
              <span className="ml-auto"><StatusBadge status={task.status} /></span>
            </div>
            <h1 className="mt-3 text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Posted {dateLabel(task.createdAt)} by{" "}
              <Link href={`/taskers/${poster.id}`} className="font-medium text-gray-700 hover:underline">{poster.name}</Link>
            </p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">Budget</dt>
                <dd className="mt-1 font-semibold text-teal-800">{budgetLabel(task)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">Offers</dt>
                <dd className="mt-1 font-semibold">{offers.filter((o) => o.status !== "declined").length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-500">Due</dt>
                <dd className="mt-1 font-semibold">{task.dueDate ? dateLabel(task.dueDate) : "Flexible"}</dd>
              </div>
            </dl>
            <div className="mt-6 whitespace-pre-wrap border-t border-gray-100 pt-5 text-gray-800">{task.description}</div>
          </section>

          {/* Offers */}
          <section className={CARD} aria-labelledby="offers-h">
            <h2 id="offers-h" className="text-lg font-semibold text-gray-900">
              {isPoster ? "Offers" : user ? "Your offer" : "Offers"}
            </h2>
            {visibleOffers.length === 0 && (
              <p className="mt-3 text-sm text-gray-600">
                {isPoster
                  ? "No offers yet. Taskers will see your task and can send offers."
                  : user
                    ? "You haven't made an offer yet."
                    : "Offers are private to the poster and the Tasker who made them."}
              </p>
            )}
            <ul className="mt-4 divide-y divide-gray-100">
              {visibleOffers.map((o) => {
                const tasker = d.users.find((u) => u.id === o.taskerId)!;
                const taskerReviews = d.reviews.filter((r) => r.revieweeId === tasker.id);
                const avg = taskerReviews.length
                  ? taskerReviews.reduce((s, r) => s + r.rating, 0) / taskerReviews.length
                  : null;
                const canAccept = isPoster && task.status === "open" && o.status === "pending";
                return (
                  <li key={o.id} className="py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <Avatar name={tasker.name} />
                        <div>
                          <Link href={`/taskers/${tasker.id}`} className="font-semibold text-gray-900 hover:underline">
                            {tasker.name}
                          </Link>
                          <div className="text-sm"><Stars value={avg} count={taskerReviews.length} /></div>
                          <div className="text-xs text-gray-500">{tasker.suburb} · Available: {o.availability}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{money(o.price)}</div>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-700">{o.message}</p>
                    {canAccept && (
                      <form action={acceptOffer} className="mt-3">
                        <input type="hidden" name="taskId" value={task.id} />
                        <input type="hidden" name="offerId" value={o.id} />
                        <button type="submit" className={BTN}>Hire {tasker.name.split(" ")[0]}</button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Chat */}
          {canSeeChat && (
            <section id="chat" className={CARD} aria-labelledby="chat-h">
              <h2 id="chat-h" className="text-lg font-semibold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500">Only you and {isPoster ? hired?.name : poster.name} can see this thread.</p>
              <div className="mt-4 max-h-96 space-y-3 overflow-y-auto rounded-lg bg-gray-50 p-4">
                {messages.length === 0 && <p className="text-sm text-gray-500">No messages yet. Say hello.</p>}
                {messages.map((m) => {
                  const mine = m.senderId === user?.id;
                  const sender = d.users.find((u) => u.id === m.senderId);
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-teal-700 text-white" : "bg-white text-gray-900 shadow-sm"}`}>
                        <p className="whitespace-pre-wrap">{m.body}</p>
                        <p className={`mt-1 text-[11px] ${mine ? "text-teal-100" : "text-gray-500"}`}>
                          {sender?.name.split(" ")[0]} · {dateTimeLabel(m.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {task.status === "in_progress" || task.status === "completed" ? (
                <form action={sendMessage} className="mt-4 flex gap-2">
                  <input type="hidden" name="taskId" value={task.id} />
                  <label htmlFor="body" className="sr-only">Message</label>
                  <input id="body" name="body" required maxLength={1000} placeholder="Write a message" className={INPUT} />
                  <button type="submit" className={BTN}>Send</button>
                </form>
              ) : null}
            </section>
          )}

          {/* Reviews */}
          {task.status === "completed" && (
            <section className={CARD} aria-labelledby="reviews-h">
              <h2 id="reviews-h" className="text-lg font-semibold text-gray-900">Reviews</h2>
              <ul className="mt-3 space-y-3">
                {reviews.map((r) => {
                  const reviewer = d.users.find((u) => u.id === r.reviewerId);
                  return (
                    <li key={r.id} className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{reviewer?.name}</span>
                        <Stars value={r.rating} />
                      </div>
                      {r.text && <p className="mt-1 text-sm text-gray-700">{r.text}</p>}
                    </li>
                  );
                })}
              </ul>
              {(isPoster || isHired) && !myReview && (
                <form action={leaveReview} className="mt-5 space-y-3">
                  <input type="hidden" name="taskId" value={task.id} />
                  <div>
                    <label htmlFor="rating" className={LABEL}>
                      Rate {isPoster ? hired?.name : poster.name}
                    </label>
                    <select id="rating" name="rating" required defaultValue="5" className={INPUT}>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="text" className={LABEL}>Comments (optional)</label>
                    <textarea id="text" name="text" rows={3} maxLength={500} className={INPUT} />
                  </div>
                  <button type="submit" className={BTN}>Submit review</button>
                </form>
              )}
            </section>
          )}
        </div>

        {/* Sidebar: actions that depend on who you are */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <section className={CARD} aria-labelledby="actions-h">
            <h2 id="actions-h" className="font-semibold text-gray-900">
              {isPoster ? "Manage this task" : "Your next step"}
            </h2>

            {/* Anonymous */}
            {!user && task.status === "open" && (
              <div className="mt-4 space-y-3 text-sm">
                <p className="text-gray-600">Log in or sign up to make an offer.</p>
                <Link href={`/auth/login?next=/tasks/${task.id}`} className={`${BTN} w-full`}>Log in to offer</Link>
              </div>
            )}

            {/* Tasker: make an offer */}
            {user && !isPoster && task.status === "open" && !myOffer && (
              <form action={makeOffer} className="mt-4 space-y-3">
                <input type="hidden" name="taskId" value={task.id} />
                <div>
                  <label htmlFor="price" className={LABEL}>Your price (AUD)</label>
                  <input id="price" name="price" type="number" min="1" step="0.01" required className={INPUT}
                    defaultValue={task.budget ?? ""} />
                  <p className="mt-1 text-xs text-gray-500">
                    You receive {SERVICE_FEE * 100}% less after the platform fee.
                  </p>
                </div>
                <div>
                  <label htmlFor="availability" className={LABEL}>When can you do it?</label>
                  <input id="availability" name="availability" placeholder="e.g. Weekday evenings" className={INPUT} />
                </div>
                <div>
                  <label htmlFor="message" className={LABEL}>Message to the poster</label>
                  <textarea id="message" name="message" rows={4} required minLength={10} maxLength={1000}
                    className={INPUT} placeholder="Introduce yourself and explain your experience." />
                </div>
                <button type="submit" className={`${BTN} w-full`}>Send offer</button>
              </form>
            )}

            {user && !isPoster && myOffer && (
              <p className="mt-4 text-sm text-gray-700">
                Your offer of <strong>{money(myOffer.price)}</strong> is{" "}
                <StatusBadge status={myOffer.status} />.
              </p>
            )}

            {/* Poster actions */}
            {isPoster && task.status === "open" && (
              <div className="mt-4 space-y-3 text-sm">
                <p className="text-gray-600">
                  {offers.filter((o) => o.status === "pending").length} pending offer(s). Hire one from the list.
                </p>
                <form action={cancelTask}>
                  <input type="hidden" name="taskId" value={task.id} />
                  <button type="submit" className={`${BTN_DANGER} w-full`}>Cancel task</button>
                </form>
              </div>
            )}

            {isPoster && task.status === "in_progress" && hired && hiredOffer && (
              <div className="mt-4 space-y-4 text-sm">
                <p className="text-gray-700">
                  Hired <strong>{hired.name}</strong> at <strong>{money(hiredOffer.price)}</strong>.
                </p>
                {task.escrow === "none" && (
                  <form action={fundEscrow} className="space-y-2">
                    <input type="hidden" name="taskId" value={task.id} />
                    <p className="text-gray-600">Fund the task to hold {money(hiredOffer.price)} in escrow. This is a simulated payment.</p>
                    <button type="submit" className={`${BTN} w-full`}>Fund {money(hiredOffer.price)} (demo)</button>
                  </form>
                )}
                {task.escrow === "funded" && !task.workDoneAt && (
                  <p className="rounded-lg bg-amber-50 p-3 text-amber-900">
                    {money(hiredOffer.price)} is held in escrow. You&apos;ll release it once the Tasker marks the work done.
                  </p>
                )}
                {task.escrow === "funded" && task.workDoneAt && (
                  <form action={confirmCompletion} className="space-y-2">
                    <input type="hidden" name="taskId" value={task.id} />
                    <p className="text-gray-600">The Tasker says the work is done. Confirm to release payment.</p>
                    <button type="submit" className={`${BTN} w-full`}>Confirm and release payment</button>
                  </form>
                )}
              </div>
            )}

            {isPoster && task.status === "completed" && (
              <p className="mt-4 text-sm text-gray-700">
                Paid {money(task.agreedPrice)} on {dateLabel(task.completedAt)}. Thanks for using TaskHive.
              </p>
            )}

            {/* Hired tasker actions */}
            {isHired && task.status === "in_progress" && (
              <div className="mt-4 space-y-3 text-sm">
                <p className="text-gray-700">
                  You&apos;re hired for <strong>{money(task.agreedPrice)}</strong>. You receive{" "}
                  <strong>{money(payoutFor(task.agreedPrice ?? 0))}</strong> after the {SERVICE_FEE * 100}% fee.
                </p>
                {task.escrow !== "funded" && (
                  <p className="rounded-lg bg-gray-50 p-3 text-gray-600">Waiting for the poster to fund the task.</p>
                )}
                {task.escrow === "funded" && !task.workDoneAt && (
                  <form action={markWorkDone}>
                    <input type="hidden" name="taskId" value={task.id} />
                    <button type="submit" className={`${BTN} w-full`}>Mark work as done</button>
                  </form>
                )}
                {task.workDoneAt && (
                  <p className="rounded-lg bg-emerald-50 p-3 text-emerald-900">Marked done. Waiting for the poster to confirm.</p>
                )}
              </div>
            )}

            {/* Cancelled / other */}
            {task.status === "cancelled" && (
              <p className="mt-4 text-sm text-gray-600">This task was cancelled.</p>
            )}
            {!isPoster && task.status === "in_progress" && !isHired && (
              <p className="mt-4 text-sm text-gray-600">This task has been filled.</p>
            )}
            {isPoster && !task.hiredTaskerId && task.status === "open" && (
              <p className="mt-2 text-xs text-gray-500">Offers are hidden from other users until you hire.</p>
            )}
          </section>

          {task.status === "completed" && hired && (
            <section className={CARD}>
              <h2 className="font-semibold text-gray-900">Hired Tasker</h2>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={hired.name} />
                <div>
                  <Link href={`/taskers/${hired.id}`} className="font-medium hover:underline">{hired.name}</Link>
                  <p className="text-xs text-gray-500">{hired.suburb}</p>
                </div>
              </div>
            </section>
          )}

          {isPoster && (
            <section className={`${CARD} text-sm`}>
              <h2 className="font-semibold text-gray-900">Task details</h2>
              <p className="mt-2 text-gray-600">Escrow: {task.escrow === "none" ? "not funded" : task.escrow}</p>
              <Link href="/dashboard" className={`${BTN_OUTLINE} mt-4 w-full`}>Back to dashboard</Link>
            </section>
          )}
        </aside>
      </div>
    </Container>
  );
}
