import type { Metadata } from "next";
import { Container, PageTitle } from "@/components/ui";
import { HowItWorksInteractive } from "@/components/HowItWorksInteractive";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <Container>
      <PageTitle title="How it works" subtitle="Choose your role to see the steps, then try the fee calculator." />
      <HowItWorksInteractive />
    </Container>
  );
}
