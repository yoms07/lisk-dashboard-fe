import { useMutation } from "@tanstack/react-query";
import { deleteProduct } from "@/lib/api/products/delete";
import { toast } from "sonner";

export function useDeleteProduct(businessProfileId: string, id: string) {
  return useMutation<{ message: string }, Error, void>({
    mutationFn: () => deleteProduct(businessProfileId, id),
    onSuccess: (data) => {
      toast.success(data.message || "Product deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    },
  });
}
