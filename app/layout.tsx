import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import { OnboardingProvider } from "@/components/onboarding/provider";
import "./globals.css";

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gabarito",
});

export const metadata: Metadata = {
  title: "QDoc Onboarding",
  description:
    "Prototype of the QDoc virtual care onboarding flow for Manitoba, Nunavut, and Northwestern Ontario.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${gabarito.variable} h-full antialiased`}>
      <body className={`${gabarito.className} min-h-full bg-canvas text-ink`}>
        <OnboardingProvider>{children}</OnboardingProvider>
      </body>
    </html>
  );
}
