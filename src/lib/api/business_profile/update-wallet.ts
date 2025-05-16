"use server";

import { getSession } from "@/lib/iron-session";
import { BusinessProfile } from "./schema";

export async function updateWallet(
  businessProfileId: string,
  walletAddress: string
): Promise<BusinessProfile> {
  try {
    const session = await getSession();

    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }

    const response = await fetch(
      `${process.env.SERVER_API_URL}/business-profile/${businessProfileId}/wallet`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          wallet_type: "ethereum",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update wallet");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
