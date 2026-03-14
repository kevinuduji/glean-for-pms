"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Onboarding is now handled inline in AppShell via CreateFirstProject.
// Redirect to overview if someone navigates here directly.
export default function OnboardingPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/overview");
  }, [router]);
  return null;
}
