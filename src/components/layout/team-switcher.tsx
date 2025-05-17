"use client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TeamSwitcher() {
  const { data: teams = [], isLoading } = useAllBusinessProfiles();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const activeTeamId = pathname.split("/").pop();
  const { selectedProfile, setSelectedProfile } = useBusinessProfileStore();

  // Only set initial profile if none is selected
  React.useEffect(() => {
    if (!isLoading && !selectedProfile && teams.length > 0) {
      const team = teams.find((team) => team.id === activeTeamId) || teams[0];
      setSelectedProfile(team);
    }
  }, [teams, activeTeamId, isLoading, setSelectedProfile, selectedProfile]);

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
              <Avatar className="size-8">
                {selectedProfile?.logo_url ? (
                  <AvatarImage
                    src={selectedProfile.logo_url}
                    alt={selectedProfile.business_name}
                  />
                ) : null}
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {selectedProfile?.business_name
                    ? getInitials(selectedProfile.business_name)
                    : "?"}
                </AvatarFallback>
              </Avatar>
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
                <Avatar className="size-6">
                  {team.logo_url ? (
                    <AvatarImage src={team.logo_url} alt={team.business_name} />
                  ) : null}
                  <AvatarFallback className="text-xs">
                    {getInitials(team.business_name)}
                  </AvatarFallback>
                </Avatar>
                {team.business_name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <Avatar className="size-6">
                <AvatarFallback className="bg-background">
                  <Plus className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
