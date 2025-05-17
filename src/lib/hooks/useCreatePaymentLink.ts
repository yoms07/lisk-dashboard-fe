import { useMutation } from "@tanstack/react-query";
import { createPaymentLink } from "@/lib/api/payments/create-link";
import {
  CreatePaymentLinkRequest,
  PaymentLinkDto,
} from "@/lib/api/payments/schema";
import { toast } from "sonner";

export function useCreatePaymentLink(businessProfileId: string) {
  return useMutation<PaymentLinkDto, Error, CreatePaymentLinkRequest>({
    mutationFn: (data: CreatePaymentLinkRequest) =>
      createPaymentLink(businessProfileId, data),
    onSuccess: (data) => {
      toast.success("Payment link created successfully");
      return data;
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create payment link"
      );
    },
  });
}
