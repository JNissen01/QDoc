"use client";

import type { StepId } from "@/lib/onboarding-flow";
import { WelcomeStep } from "@/components/onboarding/steps/welcome";
import {
  CoverageStep,
  IssuedProvinceStep,
  OffRampStep,
  ServiceAreaStep,
} from "@/components/onboarding/steps/triage";
import {
  AccountStep,
  ConfirmEmailStep,
} from "@/components/onboarding/steps/account";
import { AddressStep, ProfileStep } from "@/components/onboarding/steps/profile";
import {
  HealthCardStep,
  InsuranceStep,
  PaymentStep,
  ScanCardStep,
} from "@/components/onboarding/steps/coverage-details";
import { CheckpointStep } from "@/components/onboarding/steps/checkpoint";
import {
  BiometricsStep,
  FamilyDoctorStep,
  PharmacyStep,
} from "@/components/onboarding/steps/clinical";
import {
  AllergiesStep,
  ConditionsStep,
  MedicalHistoryStep,
  MedicationsStep,
} from "@/components/onboarding/steps/health-profile";
import { SuccessStep } from "@/components/onboarding/steps/success";

export function StepView({ step }: { step: StepId }) {
  switch (step) {
    case "welcome":
      return <WelcomeStep />;
    case "service-area":
      return <ServiceAreaStep />;
    case "coverage":
      return <CoverageStep />;
    case "issued-province":
      return <IssuedProvinceStep />;
    case "off-ramp":
      return <OffRampStep />;
    case "account":
      return <AccountStep />;
    case "confirm-email":
      return <ConfirmEmailStep />;
    case "profile":
      return <ProfileStep />;
    case "address":
      return <AddressStep />;
    case "scan-card":
      return <ScanCardStep />;
    case "health-card":
      return <HealthCardStep />;
    case "insurance":
      return <InsuranceStep />;
    case "payment":
      return <PaymentStep />;
    case "checkpoint":
      return <CheckpointStep />;
    case "pharmacy":
      return <PharmacyStep />;
    case "family-doctor":
      return <FamilyDoctorStep />;
    case "biometrics":
      return <BiometricsStep />;
    case "medical-history":
      return <MedicalHistoryStep />;
    case "medications":
      return <MedicationsStep />;
    case "allergies":
      return <AllergiesStep />;
    case "conditions":
      return <ConditionsStep />;
    case "success":
      return <SuccessStep />;
  }
}
