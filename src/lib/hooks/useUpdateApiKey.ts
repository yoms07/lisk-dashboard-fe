import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApiKey } from "@/lib/api/business_profile/update-api-key";
import { toast } from "sonner";
import { BusinessProfile } from "@/lib/api/business_profile/schema";
import { useBusinessProfileStore } from "@/lib/store/business-profile";

export function useUpdateApiKey() {
  const queryClient = useQueryClient();
  const setSelectedProfile = useBusinessProfileStore(
    (state) => state.setSelectedProfile
  );

  return useMutation({
    mutationFn: updateApiKey,
    onSuccess: (updatedProfile: BusinessProfile) => {
      // Update the React Query cache
      queryClient.setQueryData<BusinessProfile[]>(
        ["business-profiles"],
        (oldData) => {
          if (!oldData) return [updatedProfile];
          return oldData.map((profile) =>
            profile.id === updatedProfile.id ? updatedProfile : profile
          );
        }
      );

      // Update the Zustand store if this is the selected profile
      const currentProfile = useBusinessProfileStore.getState().selectedProfile;
      console.log("currentProfile");
      console.log(currentProfile);
      console.log("updatedProfile");
      console.log(updatedProfile);
      if (currentProfile?.id === updatedProfile.id) {
        setSelectedProfile(updatedProfile);
      }

      toast.success("API key updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update API key"
      );
    },
  });
}
