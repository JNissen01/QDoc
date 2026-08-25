import { redirect } from "next/navigation";

/** Legacy combined insurance screen → first private-insurance step. */
export default function InsuranceRedirectPage() {
  redirect("/onboarding/insurance-provider");
}
