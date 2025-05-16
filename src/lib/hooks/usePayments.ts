import { useQuery } from "@tanstack/react-query";
import { getAllPayments } from "@/lib/api/payments/get-all";
import { PaymentResponse } from "@/lib/api/payments/schema";

export function usePayments(
  businessProfileId: string,
  limit: number,
  page: number
) {
  return useQuery<PaymentResponse>({
    queryKey: ["payments", businessProfileId, limit, page],
    queryFn: () => getAllPayments(businessProfileId, limit, page),
    enabled: !!businessProfileId, // Only run the query if the businessProfileId is available
  });
}
