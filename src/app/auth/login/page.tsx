import type { Metadata } from "next";
import Link from "next/link";
import { logIn } from "@/app/actions";
import { BTN, CARD, Container, INPUT, LABEL, Notice } from "@/components/ui";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <Container className="max-w-md">
      <div className={`${CARD} space-y-5`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log in</h1>
          <p className="mt-1 text-sm text-gray-600">
            New here? <Link href="/auth/signup" className="font-semibold text-teal-700 hover:underline">Create an account</Link>
          </p>
        </div>
        <Notice error={sp.error} />
        <form action={logIn} className="space-y-4">
          <input type="hidden" name="next" value={sp.next ?? "/dashboard"} />
          <div>
            <label htmlFor="email" className={LABEL}>Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className={INPUT} />
          </div>
          <div>
            <label htmlFor="password" className={LABEL}>Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className={INPUT} />
          </div>
          <button type="submit" className={`${BTN} w-full py-2.5`}>Log in</button>
        </form>
        <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-700">Demo accounts (password: password123)</p>
          <p className="mt-1">alex@example.com (poster) · sam@example.com, priya@example.com, tom@example.com (Taskers)</p>
        </div>
      </div>
    </Container>
  );
}
