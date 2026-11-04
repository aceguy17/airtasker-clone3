import type { Metadata } from "next";
import { readData } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { createTask } from "@/app/actions";
import { BTN, CARD, Container, INPUT, LABEL, Notice, PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Post a task" };

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireUser("/tasks/new");
  const sp = await searchParams;
  const { categories } = readData();

  return (
    <Container className="max-w-3xl">
      <PageTitle title="Post a task" subtitle="Tell Taskers what you need. It's free to post." />
      <Notice error={sp.error} />

      <form action={createTask} className={`${CARD} space-y-6`}>
        <section className="space-y-4">
          <h2 className="font-semibold text-gray-900">The job</h2>
          <div>
            <label htmlFor="title" className={LABEL}>Title</label>
            <input id="title" name="title" required minLength={5} maxLength={100} className={INPUT}
              placeholder="e.g. Assemble a bed frame" />
          </div>
          <div>
            <label htmlFor="categoryId" className={LABEL}>Category</label>
            <select id="categoryId" name="categoryId" required defaultValue="" className={INPUT}>
              <option value="" disabled>Choose a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className={LABEL}>Description</label>
            <textarea id="description" name="description" required minLength={20} maxLength={3000} rows={6}
              className={INPUT} placeholder="What needs doing, what tools or supplies are needed, anything the Tasker should know." />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-gray-900">Where and when</h2>
          <fieldset>
            <legend className={LABEL}>Location</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="mode" value="in-person" defaultChecked /> In person</label>
              <label className="flex items-center gap-2"><input type="radio" name="mode" value="remote" /> Remote (online)</label>
            </div>
          </fieldset>
          <div>
            <label htmlFor="suburb" className={LABEL}>Suburb (for in-person tasks)</label>
            <input id="suburb" name="suburb" maxLength={60} className={INPUT} placeholder="e.g. Mitcham" />
          </div>
          <div>
            <label htmlFor="dueDate" className={LABEL}>Preferred date (optional)</label>
            <input id="dueDate" name="dueDate" type="date" className={INPUT} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-gray-900">Budget</h2>
          <fieldset>
            <legend className={LABEL}>How do you want to pay?</legend>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="budgetType" value="fixed" defaultChecked /> Fixed price</label>
              <label className="flex items-center gap-2"><input type="radio" name="budgetType" value="hourly" /> Hourly rate</label>
              <label className="flex items-center gap-2"><input type="radio" name="budgetType" value="open" /> Open to offers (Taskers set the price)</label>
            </div>
          </fieldset>
          <div>
            <label htmlFor="budget" className={LABEL}>Budget in AUD (leave blank if open to offers)</label>
            <input id="budget" name="budget" type="number" min="1" step="0.01" className={INPUT} placeholder="e.g. 120" />
          </div>
        </section>

        <button type="submit" className={`${BTN} w-full py-3`}>Post task</button>
      </form>
    </Container>
  );
}
