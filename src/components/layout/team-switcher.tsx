import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAllBusinessProfiles } from "@/lib/hooks/useAllBusinessProfiles";
import { usePathname } from "next/navigation";
import { BusinessProfile } from "@/lib/api/business_profile/schema";
import { useBusinessProfileStore } from "@/lib/store/business-profile";

export function TeamSwitcher() {
  const { data: teams = [], isLoading } = useAllBusinessProfiles();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const activeTeamId = pathname.split("/").pop();
  const { selectedProfile, setSelectedProfile } = useBusinessProfileStore();

  React.useEffect(() => {
    if (!isLoading) {
      const team =
        teams.find((team) => team.id === activeTeamId) || teams[0] || null;
      setSelectedProfile(team);
    }
  }, [teams, activeTeamId, isLoading, setSelectedProfile]);

  const handleTeamSwitch = (team: BusinessProfile) => {
    setSelectedProfile(team);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {selectedProfile ? (
                  <img
                    src={selectedProfile.logo_url}
                    alt={selectedProfile.business_name}
                    className="size-4"
                  />
                ) : (
                  <div className="size-4 bg-muted" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedProfile
                    ? selectedProfile.business_name
                    : "No Active Team"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleTeamSwitch(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <img
                    src={team.logo_url}
                    alt={team.business_name}
                    className="size-4 shrink-0"
                  />
                </div>
                {team.business_name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
