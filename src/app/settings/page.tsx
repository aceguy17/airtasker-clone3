import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { updateProfile, verifyPhoneDemo } from "@/app/actions";
import { BTN, BTN_OUTLINE, CARD, Container, INPUT, LABEL, Notice, PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireUser("/settings");
  const sp = await searchParams;

  return (
    <Container className="max-w-3xl">
      <PageTitle title="Profile and settings" subtitle="This is how Posters and other Taskers see you." />
      <Notice error={sp.error} message={sp.saved ? "Your changes have been saved." : undefined} />

      <form action={updateProfile} className={`${CARD} space-y-5`}>
        <div>
          <label htmlFor="name" className={LABEL}>Full name</label>
          <input id="name" name="name" defaultValue={user.name} required maxLength={80} className={INPUT} />
        </div>
        <div>
          <label htmlFor="suburb" className={LABEL}>Suburb</label>
          <input id="suburb" name="suburb" defaultValue={user.suburb} maxLength={60} className={INPUT} />
        </div>
        <div>
          <label htmlFor="bio" className={LABEL}>About you</label>
          <textarea id="bio" name="bio" rows={4} maxLength={500} defaultValue={user.bio} className={INPUT}
            placeholder="Tell Posters about your experience and how you work." />
        </div>
        <div>
          <label htmlFor="skills" className={LABEL}>Skills (comma separated)</label>
          <input id="skills" name="skills" defaultValue={user.skills.join(", ")} className={INPUT}
            placeholder="e.g. Cleaning, Assembly, Gardening" />
          <p className="mt-1 text-xs text-gray-500">Add skills to appear in Find Taskers.</p>
        </div>
        <button type="submit" className={BTN}>Save profile</button>
      </form>

      <section className={`${CARD} mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <h2 className="font-semibold text-gray-900">Phone verification</h2>
          <p className="text-sm text-gray-600">
            {user.phoneVerified
              ? "Your phone is verified."
              : "Verified profiles get more offers. This demo marks your phone as verified without sending a text."}
          </p>
        </div>
        {!user.phoneVerified && (
          <form action={verifyPhoneDemo}>
            <button type="submit" className={BTN_OUTLINE}>Verify phone (demo)</button>
          </form>
        )}
      </section>
    </Container>
  );
}
