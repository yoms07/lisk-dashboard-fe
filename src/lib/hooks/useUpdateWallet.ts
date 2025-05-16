import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWallet } from "@/lib/api/business_profile/update-wallet";
import { toast } from "sonner";
import { BusinessProfile } from "@/lib/api/business_profile/schema";
import { useBusinessProfileStore } from "@/lib/store/business-profile";

export function useUpdateWallet() {
  const queryClient = useQueryClient();
  const setSelectedProfile = useBusinessProfileStore(
    (state) => state.setSelectedProfile
  );

  return useMutation({
    mutationFn: ({
      businessId,
      walletAddress,
    }: {
      businessId: string;
      walletAddress: string;
    }) => updateWallet(businessId, walletAddress),
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

      toast.success("Wallet updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update wallet"
      );
    },
  });
}
