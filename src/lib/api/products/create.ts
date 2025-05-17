"use server";

import { getSession } from "@/lib/iron-session";
import { CreateProductRequest, Product } from "./schema";

export async function createProduct(
  businessProfileId: string,
  data: CreateProductRequest
): Promise<Product> {
  try {
    const session = await getSession();
    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }
    console.log(businessProfileId);
    const response = await fetch(
      `${process.env.SERVER_API_URL}/products/${businessProfileId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create product");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
