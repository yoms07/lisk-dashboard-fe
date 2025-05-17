"use server";

import { getSession } from "@/lib/iron-session";
import { Product } from "./schema";

export async function updateProduct(
  businessProfileId: string,
  id: string,
  data: Partial<{
    item_name: string;
    item_description: string;
    category: string;
    unit_price: string;
    unit_currency: string;
    sku: string;
    stock: number;
    image_url: string;
    metadata: Record<string, unknown>;
  }>
): Promise<Product> {
  try {
    const session = await getSession();
    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }
    const response = await fetch(
      `${process.env.SERVER_API_URL}/products/${businessProfileId}/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update product");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
