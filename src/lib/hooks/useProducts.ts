import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/api/products/get-all";
import { Product } from "@/lib/api/products/schema";

export function useProducts(businessProfileId: string) {
  return useQuery<Product[]>({
    queryKey: ["products", businessProfileId],
    queryFn: () => getAllProducts(businessProfileId),
    enabled: !!businessProfileId,
  });
}
