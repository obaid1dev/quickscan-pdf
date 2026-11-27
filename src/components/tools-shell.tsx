import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { type ReactNode } from "react";

export function ToolsShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
