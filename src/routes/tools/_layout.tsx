import { createFileRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/tools/_layout")({
  component: ToolsLayout,
});

function ToolsLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
