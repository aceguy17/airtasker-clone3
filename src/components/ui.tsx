import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logOut } from "@/app/actions";
import { STATUS_LABEL } from "@/lib/format";

export { BTN, BTN_OUTLINE, BTN_DANGER, INPUT, LABEL, CARD } from "./styles";
import { BTN, BTN_OUTLINE } from "./styles";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
    </div>
  );
}

export function Notice({ error, message }: { error?: string; message?: string }) {
  if (error)
    return (
      <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </div>
    );
  if (message)
    return (
      <div role="status" className="mb-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
        {message}
      </div>
    );
  return null;
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-gray-200 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  pending: "bg-sky-100 text-sky-800",
  accepted: "bg-emerald-100 text-emerald-800",
  declined: "bg-gray-100 text-gray-600",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] ?? ""}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function Stars({ value, count }: { value: number | null; count?: number }) {
  if (value == null) return <span className="text-sm text-gray-500">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm text-gray-800">
      <span className="text-amber-500" aria-hidden="true">
        {"★".repeat(Math.round(value))}
        <span className="text-gray-300">{"★".repeat(5 - Math.round(value))}</span>
      </span>
      <span className="font-semibold">{value.toFixed(1)}</span>
      {count != null && <span className="text-gray-500">({count})</span>}
    </span>
  );
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-800"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-teal-700">
          TaskHive
        </Link>
        <nav aria-label="Main" className="flex flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap text-sm font-medium text-gray-700 md:justify-center">
          <Link href="/tasks" className="hover:text-teal-700">Browse tasks</Link>
          <Link href="/taskers" className="hover:text-teal-700">Find Taskers</Link>
          <Link href="/how-it-works" className="hover:text-teal-700">How it works</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link href="/messages" className="hidden text-gray-700 hover:text-teal-700 sm:inline">Messages</Link>
              <Link href="/dashboard" className="hidden text-gray-700 hover:text-teal-700 sm:inline">Dashboard</Link>
              <Link href="/tasks/new" className={BTN}>Post a task</Link>
              <form action={logOut}>
                <button type="submit" className="text-gray-600 hover:text-teal-700">Log out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700 hover:text-teal-700">Log in</Link>
              <Link href="/auth/signup" className={BTN}>Sign up</Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <Container className="flex flex-col gap-3 py-8 text-sm text-gray-600 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} TaskHive. A demo project, not affiliated with any real marketplace.</p>
        <div className="flex gap-5">
          <Link href="/how-it-works" className="hover:text-teal-700">How it works</Link>
          <Link href="/tasks" className="hover:text-teal-700">Browse tasks</Link>
          <Link href="/taskers" className="hover:text-teal-700">Find Taskers</Link>
        </div>
      </Container>
    </footer>
  );
}
