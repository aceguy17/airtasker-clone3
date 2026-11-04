import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readData } from "@/lib/db";
import { Avatar, CARD, Container, Stars, StatusBadge } from "@/components/ui";
import { dateLabel, money } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const user = readData().users.find((u) => u.id === id);
  return { title: user ? user.name : "Profile not found" };
}

export default async function TaskerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = readData();
  const user = d.users.find((u) => u.id === id);
  if (!user) notFound();

  const reviews = d.reviews
    .filter((r) => r.revieweeId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const completed = d.tasks.filter((t) => t.hiredTaskerId === user.id && t.status === "completed");
  const activeOffers = d.offers.filter((o) => o.taskerId === user.id && o.status === "pending");

  return (
    <Container className="max-w-4xl">
      <section className={`${CARD} flex flex-col gap-5 sm:flex-row sm:items-center`}>
        <Avatar name={user.name} size={72} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-600">{user.suburb}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <Stars value={avg} count={reviews.length} />
            <span className="text-gray-500">· {completed.length} completed job{completed.length === 1 ? "" : "s"}</span>
            {user.phoneVerified && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Phone verified</span>
            )}
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className={CARD}>
            <h2 className="font-semibold text-gray-900">About</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">{user.bio || "No bio yet."}</p>
          </section>

          <section className={CARD}>
            <h2 className="font-semibold text-gray-900">Reviews</h2>
            {reviews.length === 0 && <p className="mt-2 text-sm text-gray-600">No reviews yet.</p>}
            <ul className="mt-3 space-y-4">
              {reviews.map((r) => {
                const reviewer = d.users.find((u) => u.id === r.reviewerId);
                const task = d.tasks.find((t) => t.id === r.taskId);
                return (
                  <li key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-medium">{reviewer?.name}</span>
                      <span className="text-gray-500">{dateLabel(r.createdAt)}</span>
                    </div>
                    <Stars value={r.rating} />
                    {task && (
                      <p className="mt-1 text-xs text-gray-500">
                        For: <Link href={`/tasks/${task.id}`} className="hover:underline">{task.title}</Link>
                      </p>
                    )}
                    {r.text && <p className="mt-2 text-sm text-gray-700">{r.text}</p>}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <section className={CARD}>
            <h2 className="font-semibold text-gray-900">Skills</h2>
            {user.skills.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">Not listed yet.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {user.skills.map((s) => (
                  <Link key={s} href={`/taskers?q=${encodeURIComponent(s)}`}
                    className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 hover:bg-teal-100">
                    {s}
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className={CARD}>
            <h2 className="font-semibold text-gray-900">Recent completed work</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {completed.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-2">
                  <Link href={`/tasks/${t.id}`} className="hover:underline">{t.title}</Link>
                  <span className="shrink-0 text-gray-600">{money(t.agreedPrice)}</span>
                </li>
              ))}
              {completed.length === 0 && <li className="text-gray-600">None yet.</li>}
            </ul>
            {activeOffers.length > 0 && (
              <p className="mt-4 text-xs text-gray-500">
                <StatusBadge status="pending" /> {activeOffers.length} open offer{activeOffers.length === 1 ? "" : "s"}
              </p>
            )}
          </section>
        </aside>
      </div>
    </Container>
  );
}
