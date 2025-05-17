"use server";

import { getSession } from "@/lib/iron-session";
import { Product } from "./schema";

export async function updateProductStock(
  businessProfileId: string,
  id: string,
  quantity: number
): Promise<Product> {
  try {
    const session = await getSession();
    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }
    const response = await fetch(
      `${process.env.SERVER_API_URL}/products/${businessProfileId}/${id}/stock`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ quantity }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update product stock");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
