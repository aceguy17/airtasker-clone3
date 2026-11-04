import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/ui";

export const metadata: Metadata = {
  title: { default: "TaskHive: get things done", template: "%s | TaskHive" },
  description:
    "Post a task, compare offers from local Taskers, chat, pay securely through escrow and leave reviews.",
};

// The data store is a live file, so every page renders per request, never at build time.
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
