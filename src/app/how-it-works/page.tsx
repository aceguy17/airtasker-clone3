import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorksDiagrams } from "@/components/HowItWorksDiagrams";
import { BTN, CARD, Container, PageTitle } from "@/components/ui";
import { SERVICE_FEE } from "@/lib/format";

export const metadata: Metadata = { title: "How it works" };

const steps = [
  ["Post a task", "Describe the job, add the suburb or choose remote, and set a budget or ask for offers."],
  ["Get offers", "Taskers send a price, a short message and their availability. Compare reviews and profiles."],
  ["Hire and chat", "Accept the offer that suits you. Once hired, chat in the task thread to finalise details."],
  ["Fund the task", "Your payment is held in escrow, so the Tasker knows the money is there."],
  ["Confirm and review", "When the work is done, confirm it. The Tasker is paid and you both leave a review."],
];

export default function HowItWorksPage() {
  return (
    <Container>
      <PageTitle title="How it works" subtitle="From posting a task to leaving a review, in five steps." />

      <ol className="grid gap-4 md:grid-cols-2">
        {steps.map(([title, text], i) => (
          <li key={title} className={`${CARD} flex gap-4`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-semibold text-gray-900">{title}</h2>
              <p className="mt-1 text-sm text-gray-600">{text}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className={`${CARD} mt-6`}>
        <h2 className="text-lg font-semibold text-gray-900">Fees</h2>
        <p className="mt-2 text-sm text-gray-600">
          Posting is free. TaskHive keeps a {Math.round(SERVICE_FEE * 100)}% service fee from the Tasker&apos;s payout. Posters pay the agreed price.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          This is a demo project, so no real money moves. Payments are simulated.
        </p>
      </section>

      <HowItWorksDiagrams />

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/tasks/new" className={BTN}>Post a task</Link>
        <Link href="/tasks" className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">
          Browse tasks
        </Link>
      </div>
    </Container>
  );
}
