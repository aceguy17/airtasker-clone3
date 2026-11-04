import type { Metadata } from "next";
import { readData } from "@/lib/db";
import { BTN, CARD, Container, INPUT, LABEL, PageTitle } from "@/components/ui";
import { TaskCard } from "@/components/TaskCard";

export const metadata: Metadata = { title: "Browse tasks" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

export default async function BrowseTasksPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q).toLowerCase();
  const category = first(sp.category);
  const mode = first(sp.mode);
  const min = Number(first(sp.min)) || 0;
  const max = Number(first(sp.max)) || Infinity;
  const sort = first(sp.sort) || "newest";

  const d = readData();

  let tasks = d.tasks.filter((t) => t.status === "open");
  if (q) {
    // Every word in the query must appear in the title or description.
    const words = q.split(/\s+/).filter(Boolean);
    tasks = tasks.filter((t) => {
      const haystack = `${t.title} ${t.description}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }
  if (category) tasks = tasks.filter((t) => t.categoryId === category);
  if (mode === "in-person" || mode === "remote") tasks = tasks.filter((t) => t.mode === mode);
  if (min > 0) tasks = tasks.filter((t) => t.budget == null || t.budget >= min);
  if (max < Infinity) tasks = tasks.filter((t) => t.budget == null || t.budget <= max);

  tasks.sort((a, b) => {
    if (sort === "budget_high") return (b.budget ?? -1) - (a.budget ?? -1);
    if (sort === "budget_low") return (a.budget ?? Infinity) - (b.budget ?? Infinity);
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <Container>
      <PageTitle title="Browse tasks" subtitle={`${tasks.length} open task${tasks.length === 1 ? "" : "s"} near you and online`} />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <form method="get" className={`${CARD} h-fit space-y-4`} aria-label="Filter tasks">
          <div>
            <label htmlFor="q" className={LABEL}>Keyword</label>
            <input id="q" name="q" defaultValue={first(sp.q)} className={INPUT} placeholder="Search" />
          </div>
          <div>
            <label htmlFor="category" className={LABEL}>Category</label>
            <select id="category" name="category" defaultValue={category} className={INPUT}>
              <option value="">All categories</option>
              {d.categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <span className={LABEL}>Location</span>
            <select name="mode" defaultValue={mode} className={INPUT}>
              <option value="">In-person and remote</option>
              <option value="in-person">In-person only</option>
              <option value="remote">Remote only</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="min" className={LABEL}>Min $</label>
              <input id="min" name="min" type="number" min="0" defaultValue={first(sp.min)} className={INPUT} />
            </div>
            <div>
              <label htmlFor="max" className={LABEL}>Max $</label>
              <input id="max" name="max" type="number" min="0" defaultValue={first(sp.max)} className={INPUT} />
            </div>
          </div>
          <div>
            <label htmlFor="sort" className={LABEL}>Sort by</label>
            <select id="sort" name="sort" defaultValue={sort} className={INPUT}>
              <option value="newest">Newest</option>
              <option value="budget_high">Highest budget</option>
              <option value="budget_low">Lowest budget</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className={`${BTN} flex-1`}>Apply</button>
            <a href="/tasks" className="inline-flex items-center rounded-lg px-3 text-sm text-gray-600 hover:underline">Reset</a>
          </div>
        </form>

        <div className="grid gap-4">
          {tasks.length === 0 && (
            <div className={`${CARD} text-center text-gray-600`}>
              No tasks match those filters. Try widening your search.
            </div>
          )}
          {tasks.map((t) => {
            const category = d.categories.find((c) => c.id === t.categoryId);
            const poster = d.users.find((u) => u.id === t.posterId);
            const offerCount = d.offers.filter((o) => o.taskId === t.id && o.status === "pending").length;
            return (
              <TaskCard key={t.id} task={t} category={category} poster={poster} offerCount={offerCount} />
            );
          })}
        </div>
      </div>
    </Container>
  );
}
