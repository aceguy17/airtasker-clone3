import type { Metadata } from "next";
import Link from "next/link";
import { readData } from "@/lib/db";
import { BTN, CARD, Avatar, Container, INPUT, PageTitle, Stars } from "@/components/ui";

export const metadata: Metadata = { title: "Find Taskers" };

export default async function TaskersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const d = readData();

  const taskers = d.users
    .filter((u) => u.skills.length > 0)
    .map((u) => {
      const reviews = d.reviews.filter((r) => r.revieweeId === u.id);
      const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
      const jobs = d.tasks.filter((t) => t.hiredTaskerId === u.id && t.status === "completed").length;
      return { user: u, avg, reviewCount: reviews.length, jobs };
    })
    .filter(
      ({ user }) =>
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.suburb.toLowerCase().includes(q) ||
        user.skills.some((s) => s.toLowerCase().includes(q)),
    )
    .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0) || b.jobs - a.jobs);

  return (
    <Container>
      <PageTitle title="Find Taskers" subtitle="Skilled people ready to help with your next task." />
      <form method="get" className="mb-6 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="q" className="sr-only">Search Taskers</label>
        <input id="q" name="q" defaultValue={sp.q ?? ""} placeholder="Search by name, suburb or skill"
          className={`${INPUT} sm:max-w-md`} />
        <button type="submit" className={BTN}>Search</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {taskers.map(({ user, avg, reviewCount, jobs }) => (
          <Link key={user.id} href={`/taskers/${user.id}`} className={`${CARD} block hover:border-teal-400`}>
            <div className="flex items-center gap-3">
              <Avatar name={user.name} size={48} />
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-gray-900">{user.name}</h2>
                <p className="text-xs text-gray-500">{user.suburb}{user.phoneVerified ? " · Phone verified" : ""}</p>
              </div>
            </div>
            <div className="mt-3 text-sm"><Stars value={avg} count={reviewCount} /></div>
            <p className="mt-2 text-sm text-gray-700">{user.bio}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {user.skills.map((s) => (
                <span key={s} className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">{s}</span>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">{jobs} completed job{jobs === 1 ? "" : "s"}</p>
          </Link>
        ))}
        {taskers.length === 0 && <p className="text-gray-600">No Taskers match that search.</p>}
      </div>
    </Container>
  );
}
