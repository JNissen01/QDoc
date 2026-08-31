export type CoverageType = "provincial" | "private" | "uninsured";
export type Province = "MB" | "ON" | "NU";
export type BloodType =
  | "unknown"
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";
export type MeasurementSystem = "metric" | "imperial";
export type HistoryCategory =
  | "medications"
  | "allergies"
  | "conditions"
  | "surgeries"
  | "none";
export type Severity = "mild" | "moderate" | "severe";

export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export type Clinic = {
  id: string;
  name: string;
  address: string;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
};

export type OnboardingState = {
  inServiceArea: boolean | null;
  coverage: CoverageType | null;
  issuedProvince: Province | null;
  /** Free-text province/location for the off-ramp waitlist. */
  waitlistLocation: string;
  waitlistEmail: string;
  waitlistJoined: boolean;
  email: string;
  password: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  dob: string;
  pronouns: string;
  sex: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  province: Province | null;
  registrationNumber: string;
  healthCardNumber: string;
  healthCardExpiry: string;
  healthCardScanned: boolean;
  insuranceProvider: string;
  policyNumber: string;
  memberId: string;
  cardholderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  nihbId: string;
  ifhpId: string;
  pharmacy: Pharmacy | null;
  hasFamilyDoctor: boolean | null;
  familyDoctor: Clinic | null;
  measurementSystem: MeasurementSystem;
  /** Height in centimeters (canonical). Converted for imperial display. */
  height: string;
  /** Weight in kilograms (canonical). Converted for imperial display. */
  weight: string;
  bloodType: BloodType;
  historyCategories: HistoryCategory[];
  medications: Medication[];
  allergies: string[];
  conditions: string[];
  surgeries: string[];
};

export const defaultOnboardingState: OnboardingState = {
  inServiceArea: null,
  coverage: null,
  issuedProvince: null,
  waitlistLocation: "",
  waitlistEmail: "",
  waitlistJoined: false,
  email: "",
  password: "",
  emailVerified: false,
  firstName: "",
  lastName: "",
  dob: "",
  pronouns: "",
  sex: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  province: null,
  registrationNumber: "",
  healthCardNumber: "",
  healthCardExpiry: "",
  healthCardScanned: false,
  insuranceProvider: "MSH",
  policyNumber: "",
  memberId: "",
  cardholderName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  nihbId: "",
  ifhpId: "",
  pharmacy: null,
  hasFamilyDoctor: null,
  familyDoctor: null,
  measurementSystem: "metric",
  height: "",
  weight: "",
  bloodType: "unknown",
  historyCategories: [],
  medications: [],
  allergies: [],
  conditions: [],
  surgeries: [],
};

export const STORAGE_KEY = "qdoc-onboarding-draft";

export function initialsFromName(firstName: string, lastName: string) {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  const value = `${first}${last}`.toUpperCase();
  return value || "Q";
}

export function displayFirstName(firstName: string) {
  const trimmed = firstName.trim();
  return trimmed || "there";
}

/** True once the user has saved any Phase 2 medical-profile answers. */
export function hasStartedMedicalProfile(state: OnboardingState) {
  return Boolean(
    state.height.trim() ||
      state.weight.trim() ||
      state.bloodType !== "unknown" ||
      state.pronouns.trim() ||
      state.historyCategories.length > 0 ||
      state.medications.length > 0 ||
      state.allergies.length > 0 ||
      state.conditions.length > 0 ||
      state.surgeries.length > 0 ||
      state.pharmacy ||
      state.hasFamilyDoctor !== null,
  );
}
