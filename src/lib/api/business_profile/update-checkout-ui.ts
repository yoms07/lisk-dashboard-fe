"use server";

import { getSession } from "@/lib/iron-session";
import { BusinessProfile, CheckoutUiCustomization } from "./schema";

export async function updateCheckoutUi(
  businessProfileId: string,
  customization: CheckoutUiCustomization
): Promise<BusinessProfile> {
  try {
    const session = await getSession();

    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }

    const response = await fetch(
      `${process.env.SERVER_API_URL}/business-profile/${businessProfileId}/checkout-ui`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ customization }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update checkout UI");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
