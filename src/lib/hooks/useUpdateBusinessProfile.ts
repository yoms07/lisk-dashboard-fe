import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessProfile } from "@/lib/api/business_profile/update-profile";
import { toast } from "sonner";
import { BusinessProfile } from "@/lib/api/business_profile/schema";
import { useBusinessProfileStore } from "@/lib/store/business-profile";

interface UpdateBusinessProfileData {
  business_name: string;
  contact_email: string;
  contact_phone: string;
  business_description: string;
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();
  const setSelectedProfile = useBusinessProfileStore(
    (state) => state.setSelectedProfile
  );

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: string;
      data: UpdateBusinessProfileData;
    }) => updateBusinessProfile(businessId, data),
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
      if (currentProfile?.id === updatedProfile.id) {
        setSelectedProfile(updatedProfile);
      }

      toast.success("Business profile updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update business profile"
      );
    },
  });
}
