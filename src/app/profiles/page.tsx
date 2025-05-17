"use client";
import { useState } from "react";
import { useAllBusinessProfiles } from "@/lib/hooks/useAllBusinessProfiles";
import { BusinessProfile } from "@/lib/api/business_profile/schema";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { useRouter } from "next/navigation";
import { CreateProjectOverlay } from "./(components)/create-project-overlay";

export default function ProfilePicker() {
  const router = useRouter();
  const [isCreateOverlayOpen, setIsCreateOverlayOpen] = useState(false);
  const {
    data: businessProfiles = [],
    isLoading,
    error,
  } = useAllBusinessProfiles();
  const { setSelectedProfile } = useBusinessProfileStore();

  if (error) {
    // Don't show toast for unauthorized errors as they're handled by the provider
    if (!(error instanceof Error && error.name === "UnauthorizedError")) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch business profiles"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const handleProfileSelect = (profile: BusinessProfile) => {
    setSelectedProfile(profile);
    router.push(`/dashboard`);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-gray-900 text-white">
      <div className="w-full max-w-6xl">
        <div className="flex gap-2 items-center mb-8">
          <img src="/path/to/logo.png" alt="Logo" className="h-10" />
          Application Name
        </div>
        <h1 className="text-2xl font-semibold text-left mb-4">Your projects</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          <Card
            className="w-full hover:border-primary/50 cursor-pointer transition-colors"
            onClick={() => setIsCreateOverlayOpen(true)}
          >
            <CardContent className="p-0 flex-col items-center justify-center w-full h-full">
              <div className="flex flex-col items-center justify-center gap-4 h-full">
                <PlusCircle className="h-10 w-10" />
                <span className="text-lg">Create new project</span>
              </div>
            </CardContent>
          </Card>

          {businessProfiles.map((profile: BusinessProfile) => (
            <Card
              key={profile.id}
              className="w-full hover:border-primary/50 cursor-pointer transition-colors"
              onClick={() => handleProfileSelect(profile)}
            >
              <CardContent className="p-6 h-[160px]">
                <div className="flex items-center gap-4 mb-4">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt={profile.business_name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      {profile.business_name.charAt(0)}
                    </div>
                  )}
                  <h2 className="text-lg font-medium truncate">
                    {profile.business_name}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {profile.business_description || "No description"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateProjectOverlay
        isOpen={isCreateOverlayOpen}
        onClose={() => setIsCreateOverlayOpen(false)}
      />
    </div>
  );
}
