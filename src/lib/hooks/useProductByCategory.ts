import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "@/lib/api/products/get-by-category";
import { Product } from "@/lib/api/products/schema";

export function useProductByCategory(
  businessProfileId: string,
  category: string
) {
  return useQuery<Product[]>({
    queryKey: ["products", businessProfileId, "category", category],
    queryFn: () => getProductsByCategory(businessProfileId, category),
    enabled: !!businessProfileId && !!category,
  });
}
