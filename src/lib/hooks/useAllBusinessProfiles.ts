import { useQuery } from "@tanstack/react-query";
import { getAllBusinessProfiles } from "@/lib/api/business_profile/get-all";
import { BusinessProfile } from "@/lib/api/business_profile/schema";

export function useAllBusinessProfiles() {
  return useQuery<BusinessProfile[]>({
    queryKey: ["businessProfiles"],
    queryFn: getAllBusinessProfiles,
  });
}
