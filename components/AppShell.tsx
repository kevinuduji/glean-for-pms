"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Sidebar from "@/components/Sidebar";
import { PersistentAgent } from "@/components/PersistentAgent";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/pricing"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
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

  if (!hydrated) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center animate-pulse">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    );
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
      <PersistentAgent />
    </div>
  );
}
