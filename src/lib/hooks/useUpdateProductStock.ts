import { useMutation } from "@tanstack/react-query";
import { updateProductStock } from "@/lib/api/products/update-stock";
import { Product } from "@/lib/api/products/schema";
import { toast } from "sonner";

export function useUpdateProductStock(businessProfileId: string, id: string) {
  return useMutation<Product, Error, number>({
    mutationFn: (quantity) =>
      updateProductStock(businessProfileId, id, quantity),
    onSuccess: () => {
      toast.success("Product stock updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update product stock"
      );
    },
  });
}
