import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import SkipToMain from "@/components/skip-to-main";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";
import { SearchProvider } from "@/provider/search";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultOpen = (await cookies()).get("sidebarOpen")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {/* ===== Top Heading ===== */}
      <SearchProvider>
        <SkipToMain />
        <AppSidebar />
        <div
          id="content"
          className={cn(
            "ml-auto w-full max-w-full",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "transition-[width] duration-200 ease-linear",
            "flex h-svh flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh"
          )}
        >
          {children}
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}
