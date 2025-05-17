import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/lib/api/products/create";
import { CreateProductRequest, Product } from "@/lib/api/products/schema";
import { toast } from "sonner";
import { useBusinessProfileStore } from "@/lib/store/business-profile";

export function useCreateProduct(businessProfileId: string) {
  const queryClient = useQueryClient();
  const setSelectedProfile = useBusinessProfileStore(
    (state) => state.setSelectedProfile
  );

  return useMutation<Product, Error, CreateProductRequest>({
    mutationFn: (data: CreateProductRequest) =>
      createProduct(businessProfileId, data),
    onSuccess: (newProduct: Product) => {
      queryClient.setQueryData<Product[]>(
        ["products", businessProfileId],
        (oldData) => {
          if (!oldData) return [newProduct];
          return [...oldData, newProduct];
        }
      );

      // Update the Zustand store if this is the selected profile
      const currentProfile = useBusinessProfileStore.getState().selectedProfile;
      if (currentProfile?.id === businessProfileId) {
        setSelectedProfile(currentProfile);
      }

      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    },
  });
}
