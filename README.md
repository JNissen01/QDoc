# QDoc Onboarding Prototype

A clickable prototype of the **QDoc** virtual care onboarding flow. QDoc connects patients in Manitoba, Nunavut, and Northwestern Ontario with local doctors and nurse practitioners. This repo covers onboarding only — queue, video visits, and a live product dashboard are out of scope.

The flow ends on a lightweight dashboard that matches the current design and may still change.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43173](http://localhost:43173). The app starts on the welcome screen.

To see every screen in journey order, open [http://localhost:43173/flow](http://localhost:43173/flow). Click a frame to enter that step.

## Prototype notes

- All data stays in the browser (`localStorage`). There is no backend, email, payment charge, or camera access.
- Email verification accepts **any 5-digit code** (including `12345`).
- **Use Camera**, **Scan Medication**, **Scan Card**, and **Use My Current Location** simulate extraction with short delays and canned demo data.
- Coverage branches:
  - Provincial health card → scan / enter card number
  - Private insurance → MSH policy details
  - Uninsured → payment details (optional NIHB / IFHP IDs)
- People outside the service area hit an off-ramp and cannot continue.
- After coverage is set, you can skip Phase 2 (clinical background) or complete pharmacy, history, medications, and allergies.
- Dashboard actions (Book a Visit, Inbox, and so on) are visual only.

## Stack

Next.js, TypeScript, Tailwind CSS, and shadcn/ui primitives, themed to QDoc’s soft-clinical design system (Gabarito, action blue, pill buttons).
