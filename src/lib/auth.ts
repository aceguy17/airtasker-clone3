import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { readData, update, type User } from "./db";

const COOKIE = "th_session";

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const d = readData();
  const userId = d.sessions[token];
  if (!userId) return null;
  return d.users.find((u) => u.id === userId) ?? null;
}

/** Use at the top of any page or action that needs a logged-in user. */
export async function requireUser(next: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/auth/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function startSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  update((d) => {
    d.sessions[token] = userId;
  });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    update((d) => {
      delete d.sessions[token];
    });
  }
  jar.delete(COOKIE);
}
