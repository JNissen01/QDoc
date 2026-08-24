import { notFound } from "next/navigation";
import { STEP_IDS, isStepId } from "@/lib/onboarding-flow";
import { StepView } from "@/components/onboarding/step-view";

export function generateStaticParams() {
  return STEP_IDS.map((step) => ({ step }));
}

export default async function OnboardingStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  if (!step || !isStepId(step)) {
    notFound();
  }
  return <StepView step={step} />;
}
