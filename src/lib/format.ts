/** Shared display and money helpers. Safe to import from server and client code. */

export const SERVICE_FEE = 0.1; // 10% deducted from the Tasker's payout

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/** What the Tasker receives after the platform fee. */
export function payoutFor(price: number) {
  return round2(price * (1 - SERVICE_FEE));
}

export function money(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(n);
}

export function dateLabel(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Australia/Melbourne",
  });
}

export function dateTimeLabel(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Australia/Melbourne",
  });
}

export function budgetLabel(t: { budgetType: string; budget: number | null }) {
  if (t.budgetType === "open" || t.budget == null) return "Open to offers";
  if (t.budgetType === "hourly") return `${money(t.budget)} / hour`;
  return money(t.budget);
}

export const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

/** Hide phone numbers and emails in chat and offer messages. */
export function maskContactDetails(text: string) {
  return text
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email hidden]")
    .replace(/(\+?\d[\d\s-]{7,}\d)/g, "[number hidden]");
}
