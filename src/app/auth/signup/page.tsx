import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/app/actions";
import { BTN, CARD, Container, INPUT, LABEL, Notice } from "@/components/ui";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <Container className="max-w-md">
      <div className={`${CARD} space-y-5`}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-600">
            Already have one? <Link href="/auth/login" className="font-semibold text-teal-700 hover:underline">Log in</Link>
          </p>
        </div>
        <Notice error={sp.error} />
        <form action={signUp} className="space-y-4">
          <div>
            <label htmlFor="name" className={LABEL}>Full name</label>
            <input id="name" name="name" autoComplete="name" required maxLength={80} className={INPUT} />
          </div>
          <div>
            <label htmlFor="email" className={LABEL}>Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className={INPUT} />
          </div>
          <div>
            <label htmlFor="suburb" className={LABEL}>Suburb</label>
            <input id="suburb" name="suburb" autoComplete="address-level2" maxLength={60} className={INPUT} placeholder="e.g. Richmond" />
          </div>
          <div>
            <label htmlFor="password" className={LABEL}>Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className={INPUT} />
            <p className="mt-1 text-xs text-gray-500">At least 8 characters.</p>
          </div>
          <button type="submit" className={`${BTN} w-full py-2.5`}>Create account</button>
        </form>
      </div>
    </Container>
  );
}
