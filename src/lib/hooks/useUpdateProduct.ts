import { useMutation } from "@tanstack/react-query";
import { updateProduct } from "@/lib/api/products/update";
import { Product } from "@/lib/api/products/schema";
import { toast } from "sonner";

export function useUpdateProduct(businessProfileId: string, id: string) {
  return useMutation<Product, Error, Parameters<typeof updateProduct>[2]>({
    mutationFn: (data) => updateProduct(businessProfileId, id, data),
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    },
  });
}
