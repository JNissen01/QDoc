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
  AccountIntroStep,
  ConfirmEmailStep,
  ContactStep,
  PasswordStep,
} from "@/components/onboarding/steps/account";
import {
  AddressStep,
  DobStep,
  NameStep,
  PronounsStep,
  SexStep,
} from "@/components/onboarding/steps/profile";
import {
  ConfirmInfoStep,
  HealthCardStep,
  InsuranceMemberStep,
  InsurancePolicyStep,
  InsuranceProviderStep,
  PaymentIntroStep,
  PaymentStep,
  RegistrationNumberStep,
  ScanCardStep,
  ScanningCardStep,
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
  SurgeriesStep,
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
    case "account-intro":
      return <AccountIntroStep />;
    case "confirm-email":
      return <ConfirmEmailStep />;
    case "contact":
      return <ContactStep />;
    case "password":
      return <PasswordStep />;
    case "name":
      return <NameStep />;
    case "sex":
      return <SexStep />;
    case "address":
      return <AddressStep />;
    case "dob":
      return <DobStep />;
    case "pronouns":
      return <PronounsStep />;
    case "scan-card":
      return <ScanCardStep />;
    case "scanning-card":
      return <ScanningCardStep />;
    case "registration-number":
      return <RegistrationNumberStep />;
    case "health-card":
      return <HealthCardStep />;
    case "confirm-info":
      return <ConfirmInfoStep />;
    case "insurance-provider":
      return <InsuranceProviderStep />;
    case "insurance-policy":
      return <InsurancePolicyStep />;
    case "insurance-member":
      return <InsuranceMemberStep />;
    case "payment-intro":
      return <PaymentIntroStep />;
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
    case "surgeries":
      return <SurgeriesStep />;
    case "success":
      return <SuccessStep />;
  }
}
