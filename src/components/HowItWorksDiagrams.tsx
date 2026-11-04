import { CARD, Avatar } from "./ui";
import { SERVICE_FEE, money, payoutFor } from "@/lib/format";

/** Vertical arrow on phones, horizontal arrow on larger screens. */
function Arrow() {
  return (
    <>
      <span aria-hidden="true" className="block text-center text-xl text-gray-400 sm:hidden">↓</span>
      <span aria-hidden="true" className="hidden text-xl text-gray-400 sm:block">→</span>
    </>
  );
}

function Node({ n, title, text, tone }: { n: string; title: string; text: string; tone: string }) {
  return (
    <div className={`flex-1 rounded-xl border p-4 ${tone}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70">Step {n}</p>
      <p className="mt-1 font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-80">{text}</p>
    </div>
  );
}

const SAMPLE = 100;

export function HowItWorksDiagrams() {
  const fee = Math.round(SAMPLE * SERVICE_FEE * 100) / 100;
  const payout = payoutFor(SAMPLE);
  const feePct = Math.round(SERVICE_FEE * 100);

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">The picture</h2>

      {/* 1. Lifecycle */}
      <section className={CARD} aria-labelledby="diagram-lifecycle">
        <h3 id="diagram-lifecycle" className="font-semibold text-gray-900">From posting to payment</h3>
        <p className="mt-1 text-sm text-gray-600">Every task follows the same path, from posting to payment.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <Node n="1" title="Post" text="Poster describes the job" tone="border-sky-200 bg-sky-50 text-sky-900" />
          <Arrow />
          <Node n="2" title="Offers" text="Taskers send prices" tone="border-sky-200 bg-sky-50 text-sky-900" />
          <Arrow />
          <Node n="3" title="Hire" text="Poster picks one Tasker" tone="border-amber-200 bg-amber-50 text-amber-900" />
          <Arrow />
          <Node n="4" title="Fund" text="Payment held in escrow" tone="border-amber-200 bg-amber-50 text-amber-900" />
          <Arrow />
          <Node n="5" title="Work done" text="Tasker marks it done" tone="border-amber-200 bg-amber-50 text-amber-900" />
          <Arrow />
          <Node n="6" title="Confirm and pay" text="Escrow released, both review" tone="border-emerald-200 bg-emerald-50 text-emerald-900" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2. Money split */}
        <section className={CARD} aria-labelledby="diagram-money">
          <h3 id="diagram-money" className="font-semibold text-gray-900">Where the money goes</h3>
          <p className="mt-1 text-sm text-gray-600">Example: a {money(SAMPLE)} job.</p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 rounded-lg bg-gray-100 p-3 text-center">
              <p className="text-xs text-gray-500">Poster pays</p>
              <p className="font-bold text-gray-900">{money(SAMPLE)}</p>
            </div>
            <span aria-hidden="true" className="text-xl text-gray-400">→</span>
            <div className="flex-1 rounded-lg bg-amber-50 p-3 text-center">
              <p className="text-xs text-amber-800">Held in escrow</p>
              <p className="font-bold text-amber-900">{money(SAMPLE)}</p>
            </div>
          </div>

          <div className="mt-6" role="img" aria-label={`Of ${money(SAMPLE)}, ${money(payout)} goes to the Tasker and ${money(fee)} is the TaskHive fee.`}>
            <div className="flex h-10 w-full overflow-hidden rounded-lg text-sm font-semibold">
              <div className="flex items-center justify-center bg-teal-700 text-white" style={{ width: `${100 - feePct}%` }}>
                Tasker {money(payout)}
              </div>
              <div className="flex items-center justify-center bg-amber-400 text-amber-950" style={{ width: `${feePct}%` }}>
                {feePct}%
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <span>Tasker receives {money(payout)}</span>
              <span>TaskHive fee {money(fee)}</span>
            </div>
          </div>
        </section>

        {/* 3. Task status */}
        <section className={CARD} aria-labelledby="diagram-status">
          <h3 id="diagram-status" className="font-semibold text-gray-900">Task status</h3>
          <p className="mt-1 text-sm text-gray-600">A task moves through these states. Only the poster can cancel an open task.</p>

          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Open</span>
              <span className="text-gray-500">hire a Tasker →</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">In progress</span>
              <span className="text-gray-500">confirm payment →</span>
              <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-800">Completed</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Open</span>
              <span className="text-gray-500">poster cancels →</span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-red-800">Cancelled</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
            <Avatar name="Sam Carter" size={32} />
            <p>Once a Tasker is hired, the chat opens and both people can see the task thread.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
