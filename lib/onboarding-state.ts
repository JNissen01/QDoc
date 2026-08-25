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
  reactions: string[];
  severity: Severity | null;
};

export type OnboardingState = {
  inServiceArea: boolean | null;
  coverage: CoverageType | null;
  issuedProvince: Province | null;
  email: string;
  username: string;
  password: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  dob: string;
  pronouns: string;
  gender: string;
  sex: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  province: Province | null;
  healthCardNumber: string;
  healthCardExpiry: string;
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
  height: string;
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
  email: "",
  username: "",
  password: "",
  emailVerified: false,
  firstName: "",
  lastName: "",
  dob: "",
  pronouns: "",
  gender: "",
  sex: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  province: null,
  healthCardNumber: "",
  healthCardExpiry: "",
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
