import { useQuery } from "@tanstack/react-query";
import { getSingleProduct } from "@/lib/api/products/get-single";
import { Product } from "@/lib/api/products/schema";

export function useProduct(businessProfileId: string, id: string) {
  return useQuery<Product>({
    queryKey: ["product", businessProfileId, id],
    queryFn: () => getSingleProduct(businessProfileId, id),
    enabled: !!businessProfileId && !!id,
  });
}
