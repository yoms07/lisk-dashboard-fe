import { useMutation } from "@tanstack/react-query";
import { createBusinessProfile } from "@/lib/api/business_profile/create";
import { BusinessProfile } from "@/lib/api/business_profile/schema";
import { toast } from "sonner";

interface CreateBusinessProfileRequest {
  business_name: string;
  business_description: string;
  contact_email: string;
  contact_phone: string;
  logo_url?: string;
}

export function useCreateBusinessProfile() {
  return useMutation<BusinessProfile, Error, CreateBusinessProfileRequest>({
    mutationFn: (data: CreateBusinessProfileRequest) =>
      createBusinessProfile(data),
    onSuccess: (data) => {
      toast.success("Business profile created successfully");
      return data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create business profile"
      );
    },
  });
}
