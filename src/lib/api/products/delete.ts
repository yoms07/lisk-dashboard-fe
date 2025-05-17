"use server";

import { getSession } from "@/lib/iron-session";

export async function deleteProduct(
  businessProfileId: string,
  id: string
): Promise<{ message: string }> {
  try {
    const session = await getSession();
    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }
    const response = await fetch(
      `${process.env.SERVER_API_URL}/products/${businessProfileId}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to delete product");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
