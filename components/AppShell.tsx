"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate]);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, isPublicRoute, router]);

  // For public routes, render immediately without waiting for hydration
  // to avoid a blank flash. Auth state loads in the background.
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, wait for hydration before deciding
  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
