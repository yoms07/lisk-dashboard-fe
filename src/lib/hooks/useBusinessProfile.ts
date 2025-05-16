import { useQuery } from "@tanstack/react-query";
import { getBusinessProfileById } from "@/lib/api/business_profile/get-by-id";
import { BusinessProfile } from "@/lib/api/business_profile/schema";

export function useBusinessProfile(id: string) {
  return useQuery<BusinessProfile>({
    queryKey: ["businessProfile", id],
    queryFn: () => getBusinessProfileById(id),
    enabled: !!id,
  });
}
