import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWebhook } from "@/lib/api/business_profile/update-webhook";
import { toast } from "sonner";
import { BusinessProfile } from "@/lib/api/business_profile/schema";
import { useBusinessProfileStore } from "@/lib/store/business-profile";

export function useUpdateWebhook() {
  const queryClient = useQueryClient();
  const setSelectedProfile = useBusinessProfileStore(
    (state) => state.setSelectedProfile
  );

  return useMutation({
    mutationFn: ({
      businessId,
      webhookUrl,
    }: {
      businessId: string;
      webhookUrl: string;
    }) => updateWebhook(businessId, webhookUrl),
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

      toast.success("Webhook URL updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update webhook URL"
      );
    },
  });
}
