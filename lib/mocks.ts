import type { Clinic, Pharmacy } from "@/lib/onboarding-state";

export const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: "shoppers-portage",
    name: "Shoppers Drug Mart",
    address: "1485 Portage Ave, Winnipeg, MB",
    phone: "204-774-1837",
  },
  {
    id: "rexall-graham",
    name: "Rexall",
    address: "400 Graham Ave, Winnipeg, MB",
    phone: "204-943-1193",
  },
  {
    id: "medicine-shoppe-thompson",
    name: "The Medicine Shoppe",
    address: "50 Selkirk Ave, Thompson, MB",
    phone: "204-677-2340",
  },
];

export const MOCK_CLINICS: Clinic[] = [
  {
    id: "access-west",
    name: "Access Winnipeg West",
    address: "280 Booth Dr, Winnipeg, MB",
  },
  {
    id: "st-boniface",
    name: "St. Boniface Clinic",
    address: "343 Tache Ave, Winnipeg, MB",
  },
  {
    id: "norwest",
    name: "NorWest Co-op Community Health",
    address: "103-61 Tyndall Ave, Winnipeg, MB",
  },
];

export const MOCK_LOCATION = {
  address: "123 Main Street",
  postalCode: "R3C 1A5",
  city: "Winnipeg",
  province: "MB" as const,
};

export const MOCK_HEALTH_CARD = {
  registrationNumber: "123456",
  number: "1213-456-789",
  expiry: "12/28",
};

export const MOCK_MEDICATION = {
  name: "Lexapro",
  dosage: "25mg",
  frequency: "Twice daily",
};

export const MOCK_PAYMENT_CARD = {
  cardholderName: "Jane Doe",
  cardNumber: "4242 4242 4242 4242",
  cardExpiry: "12/28",
  cardCvv: "123",
};

export const COMMON_ALLERGIES = [
  "Peanuts",
  "Latex",
  "Penicillin",
  "Shellfish",
  "Pollen",
  "Bee Stings",
];

export const COMMON_CONDITIONS = [
  "Anxiety",
  "Depression",
  "ADHD",
  "Asthma",
  "Diabetes",
  "Hypertension",
];

export const COMMON_MEDICATIONS = [
  "Lexapro",
  "Metformin",
  "Atorvastatin",
  "Amlodipine",
  "Omeprazole",
];

export const MEDICATION_DOSAGES = [
  "25mg",
  "50mg",
  "100mg",
  "250mg",
  "500mg",
];

export const MEDICATION_FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "As needed",
] as const;

export const MEDICATION_REACTIONS = [
  "Rash",
  "Swelling",
  "Hives",
  "Nausea",
  "Trouble breathing",
  "Anaphylaxis",
];

export function delay(ms = 1100) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function filterByQuery<T extends { name: string; address: string }>(
  items: T[],
  query: string,
) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q),
  );
}
