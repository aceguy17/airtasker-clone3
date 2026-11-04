import type { Metadata } from "next";
import Link from "next/link";
import { readData } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { BTN, CARD, Container, Notice, PageTitle, StatusBadge } from "@/components/ui";
import { dateLabel, money, payoutFor, round2, SERVICE_FEE } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireUser("/dashboard");
  const sp = await searchParams;
  const d = readData();

  const posted = d.tasks
    .filter((t) => t.posterId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const myOffers = d.offers
    .filter((o) => o.taskerId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const jobs = d.tasks.filter((t) => t.hiredTaskerId === user.id);
  const earned = round2(
    jobs
      .filter((t) => t.escrow === "released" && t.agreedPrice != null)
      .reduce((sum, t) => sum + payoutFor(t.agreedPrice!), 0),
  );
  const inEscrow = round2(
    jobs
      .filter((t) => t.escrow === "funded" && t.agreedPrice != null)
      .reduce((sum, t) => sum + payoutFor(t.agreedPrice!), 0),
  );

  return (
    <Container>
      <PageTitle title={`Hi, ${user.name.split(" ")[0]}`} subtitle="Track the tasks you've posted and the work you're doing." />
      <Notice
        message={sp.welcome ? "Welcome to TaskHive. Post your first task or browse open jobs." : undefined}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className={CARD}>
          <p className="text-xs uppercase tracking-wide text-gray-500">Tasks you posted</p>
          <p className="mt-1 text-2xl font-bold">{posted.length}</p>
        </div>
        <div className={CARD}>
          <p className="text-xs uppercase tracking-wide text-gray-500">Earned (after {SERVICE_FEE * 100}% fee)</p>
          <p className="mt-1 text-2xl font-bold text-teal-800">{money(earned)}</p>
        </div>
        <div className={CARD}>
          <p className="text-xs uppercase tracking-wide text-gray-500">Held in escrow for you</p>
          <p className="mt-1 text-2xl font-bold">{money(inEscrow)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={CARD} aria-labelledby="posted-h">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="posted-h" className="text-lg font-semibold">Tasks you posted</h2>
            <Link href="/tasks/new" className={BTN}>Post a task</Link>
          </div>
          {posted.length === 0 && <p className="text-sm text-gray-600">You haven&apos;t posted anything yet.</p>}
          <ul className="divide-y divide-gray-100">
            {posted.map((t) => {
              const offerCount = d.offers.filter((o) => o.taskId === t.id).length;
              return (
                <li key={t.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/tasks/${t.id}`} className="font-medium hover:underline">{t.title}</Link>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {offerCount} offer{offerCount === 1 ? "" : "s"} · Posted {dateLabel(t.createdAt)}
                    {t.escrow !== "none" && ` · Escrow: ${t.escrow}`}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={CARD} aria-labelledby="work-h">
          <h2 id="work-h" className="mb-4 text-lg font-semibold">Your offers and jobs</h2>
          {myOffers.length === 0 && (
            <p className="text-sm text-gray-600">
              You haven&apos;t made any offers yet. <Link href="/tasks" className="font-semibold text-teal-700 hover:underline">Browse tasks</Link>.
            </p>
          )}
          <ul className="divide-y divide-gray-100">
            {myOffers.map((o) => {
              const t = d.tasks.find((x) => x.id === o.taskId);
              if (!t) return null;
              return (
                <li key={o.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/tasks/${t.id}`} className="font-medium hover:underline">{t.title}</Link>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Offered {money(o.price)} · {dateLabel(o.createdAt)}
                    {t.status === "in_progress" && t.hiredTaskerId === user.id && " · You're hired"}
                    {t.status === "completed" && t.hiredTaskerId === user.id && " · Completed"}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <p className="mt-8 text-sm text-gray-600">
        Want to chat with a Tasker? Open a hired task and use the Messages section, or visit{" "}
        <Link href="/messages" className="font-semibold text-teal-700 hover:underline">your inbox</Link>.
      </p>
    </Container>
  );
}
