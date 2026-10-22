import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { heroDescription } from "@/features/landing/content";
import { LandingPage } from "@/features/landing/landing-page";
import { MotionRoot } from "@/features/landing/motion-root";

const sans = Geist({ subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap", variable: "--landing-sans", fallback: ["Arial", "sans-serif"] });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--landing-mono", fallback: ["Courier New", "monospace"] });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", display: "swap", variable: "--landing-serif", fallback: ["Georgia", "serif"] });

export const metadata: Metadata = {
  title: "Sema · Design preview",
  description: heroDescription,
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <MotionRoot fontClasses={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <LandingPage />
    </MotionRoot>
  );
}
