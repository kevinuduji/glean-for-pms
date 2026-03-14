"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useAgentStore } from "@/lib/store";
import { useProjectStore } from "@/lib/project-store";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import ProjectBrowser from "@/components/ProjectBrowser";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hydrate: hydrateAuth } = useAuthStore();
  const { hydrate: hydrateAgent } = useAgentStore();
  const { joinedProjectIds } = useProjectStore();
  const [hydrated, setHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    hydrateAuth();
    hydrateAgent();
    setHydrated(true);
  }, [hydrateAuth, hydrateAgent]);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isSection = pathname.startsWith("/section/");

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, isPublicRoute, router]);

  // Public routes render immediately
  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!hydrated) return null;
  if (!isAuthenticated) return null;

  // If authenticated but hasn't joined any projects → full-page project browser
  if (joinedProjectIds.length === 0) {
    return (
      <ProjectBrowser
        isOnboarding
        onClose={() => {
          // After first join the component re-renders automatically
          // (joinedProjectIds.length > 0 → normal shell renders)
        }}
      />
    );
  }

  const isSettingsPage = pathname === "/settings";

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Primary Sidebar */}
      {!isSettingsPage && <Sidebar />}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* TopNav only on non-section routes */}
        {!isSection && <TopNav />}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
