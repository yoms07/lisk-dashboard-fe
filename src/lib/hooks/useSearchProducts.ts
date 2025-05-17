import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api/products/search";
import { Product } from "@/lib/api/products/schema";

export function useSearchProducts(businessProfileId: string, query: string) {
  return useQuery<Product[]>({
    queryKey: ["products", businessProfileId, "search", query],
    queryFn: () => searchProducts(businessProfileId, query),
    enabled: !!businessProfileId && !!query,
  });
}
