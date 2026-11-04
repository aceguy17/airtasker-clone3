import Link from "next/link";
import { readData } from "@/lib/db";
import { BTN, BTN_OUTLINE, CARD, Container, INPUT, LABEL } from "@/components/ui";

export default function HomePage() {
  const { categories, tasks } = readData();
  const openCount = tasks.filter((t) => t.status === "open").length;

  return (
    <>
      <Container>
        <section className="grid items-center gap-10 py-8 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Local help, on demand</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              Get it done. Pay safely. Leave a review.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Post a task in a few minutes, compare offers from Taskers near you, and pay only when the work is done.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tasks/new" className={`${BTN} px-5 py-3`}>Post a task free</Link>
              <Link href="/tasks" className={`${BTN_OUTLINE} px-5 py-3`}>Browse {openCount} open tasks</Link>
            </div>
          </div>

          <form action="/tasks" method="get" className={`${CARD} space-y-4`}>
            <h2 className="text-lg font-semibold text-gray-900">What do you need help with?</h2>
            <div>
              <label htmlFor="q" className={LABEL}>Search tasks</label>
              <input id="q" name="q" placeholder="e.g. assemble, clean, garden" className={INPUT} />
            </div>
            <div>
              <label htmlFor="category" className={LABEL}>Category</label>
              <select id="category" name="category" className={INPUT} defaultValue="">
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className={`${BTN} w-full py-2.5`}>Search</button>
          </form>
        </section>

        <section className="py-10">
          <h2 className="text-2xl font-bold text-gray-900">Popular categories</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/tasks?category=${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-800 hover:border-teal-400"
              >
                <span className="text-2xl" aria-hidden="true">{c.icon}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-5 py-10 md:grid-cols-3">
          {[
            ["1. Post your task", "Describe what you need, set a budget or ask for offers, and add photos."],
            ["2. Choose a Tasker", "Compare prices, messages and reviews. Chat, then hire the right person."],
            ["3. Pay securely", "Your payment is held until you confirm the work is done. Then the Tasker is paid."],
          ].map(([title, text]) => (
            <div key={title} className={CARD}>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </section>
      </Container>
    </>
  );
}
