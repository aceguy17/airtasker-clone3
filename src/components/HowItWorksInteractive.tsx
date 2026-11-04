"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { BTN, CARD, INPUT, LABEL } from "./styles";
import { money, payoutFor, round2, SERVICE_FEE } from "@/lib/format";

type Role = "poster" | "tasker";

const STEPS: Record<Role, { title: string; summary: string; details: string[] }[]> = {
  poster: [
    {
      title: "Post your task",
      summary: "Describe the job, pick a location and set a budget or ask for offers.",
      details: [
        "Choose a category and write what needs doing.",
        "Pick in-person (with a suburb) or remote.",
        "Set a fixed, hourly or open budget. Posting is free.",
      ],
    },
    {
      title: "Compare offers",
      summary: "Taskers send a price, availability and a short message.",
      details: [
        "Offers are private: only you see them all.",
        "Check each Tasker's rating, completed jobs and suburb before you choose.",
        "Phone numbers and emails are hidden in messages until you hire.",
      ],
    },
    {
      title: "Hire and fund",
      summary: "Hire one Tasker. Their offer is declined automatically.",
      details: [
        "Your payment is held in escrow, so the Tasker knows the money is there.",
        "Chat in the task thread to agree on the details.",
      ],
    },
    {
      title: "Confirm and review",
      summary: "When the work is done, confirm it. The payment is then released.",
      details: [
        "Confirm only after you're happy with the work.",
        "Leave a review. Your review helps the next poster choose well.",
      ],
    },
  ],
  tasker: [
    {
      title: "Browse tasks",
      summary: "Filter by category, location, budget and date.",
      details: [
        "Search by keyword, or filter by category and price range.",
        "Open a task to read the full description and see what the poster needs.",
      ],
    },
    {
      title: "Send an offer",
      summary: "Quote a price, say when you're free and explain why you're a good fit.",
      details: [
        "Keep your message clear and specific. Taskers with clear offers get hired more.",
        "You can only have one pending offer per task.",
      ],
    },
    {
      title: "Get hired and chat",
      summary: "Once hired, chat with the poster in the task thread.",
      details: [
        "Wait for the poster to fund the task before you start.",
        "Keep all communication on TaskHive.",
      ],
    },
    {
      title: "Finish and get paid",
      summary: "Mark the work as done. The payment is released after the poster confirms.",
      details: [
        `TaskHive keeps a ${Math.round(SERVICE_FEE * 100)}% service fee from your payout.`,
        "Ask for a review. Good reviews bring more offers.",
      ],
    },
  ],
};

export function HowItWorksInteractive() {
  const [role, setRole] = useState<Role>("poster");
  const [open, setOpen] = useState<number>(0);
  const [price, setPrice] = useState<string>("200");
  const idBase = useId();

  const amount = Number(price);
  const valid = Number.isFinite(amount) && amount > 0;
  const fee = valid ? round2(amount * SERVICE_FEE) : 0;
  const payout = valid ? payoutFor(amount) : 0;

  return (
    <div className="space-y-10">
      {/* Role switch */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <span className="text-sm font-medium text-gray-700">I want to</span>
        <div role="tablist" aria-label="Choose your role" className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
          {(["poster", "tasker"] as Role[]).map((r) => {
            const selected = role === r;
            return (
              <button
                key={r}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${idBase}-panel`}
                onClick={() => {
                  setRole(r);
                  setOpen(0);
                }}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  selected ? "bg-teal-700 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {r === "poster" ? "Get a task done" : "Earn by doing tasks"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Steps accordion */}
      <ol id={`${idBase}-panel`} role="tabpanel" className="space-y-3">
        {STEPS[role].map((step, i) => {
          const isOpen = open === i;
          const panelId = `${idBase}-${role}-${i}`;
          return (
            <li key={`${role}-${step.title}`} className={`${CARD} p-0`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold text-gray-900">{step.title}</span>
                    <span className="block text-sm text-gray-600">{step.summary}</span>
                  </span>
                  <span aria-hidden="true" className={`text-xl text-gray-400 transition-transform ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
              </h3>
              {isOpen && (
                <div id={panelId} className="border-t border-gray-100 px-5 pb-5 pt-4">
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                    {step.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Fee calculator */}
      <section className={CARD} aria-labelledby={`${idBase}-fee`}>
        <h2 id={`${idBase}-fee`} className="text-lg font-semibold text-gray-900">Fee calculator</h2>
        <p className="mt-1 text-sm text-gray-600">
          See what a Tasker takes home from a job. Posting is free for posters.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-[1fr_1fr]">
          <div>
            <label htmlFor={`${idBase}-price`} className={LABEL}>Agreed price (AUD)</label>
            <input
              id={`${idBase}-price`}
              type="number"
              min="1"
              step="1"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={INPUT}
            />
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={valid ? Math.min(Math.max(amount, 20), 1000) : 20}
              onChange={(e) => setPrice(e.target.value)}
              aria-label="Agreed price slider"
              className="mt-4 w-full accent-teal-700"
            />
          </div>
          <dl className="grid content-start gap-3 rounded-lg bg-gray-50 p-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Poster pays</dt>
              <dd className="font-semibold">{valid ? money(amount) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">TaskHive service fee ({Math.round(SERVICE_FEE * 100)}%)</dt>
              <dd className="font-semibold">{valid ? money(fee) : "—"}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
              <dt className="font-semibold text-gray-900">Tasker receives</dt>
              <dd className="font-bold text-teal-800">{valid ? money(payout) : "—"}</dd>
            </div>
          </dl>
        </div>
        {!valid && <p role="alert" className="mt-3 text-sm text-red-700">Enter an amount above $0 to see the fee.</p>}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/tasks/new" className={BTN}>Post a task</Link>
        <Link href="/tasks" className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">
          Browse tasks
        </Link>
      </div>
    </div>
  );
}
