"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useAgentStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hydrate: hydrateAuth } = useAuthStore();
  const { hydrate: hydrateAgent } = useAgentStore();
  const [hydrated, setHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    hydrateAuth();
    hydrateAgent();
    setHydrated(true);
  }, [hydrateAuth, hydrateAgent]);

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
