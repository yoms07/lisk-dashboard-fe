"use server";

import { getSession } from "@/lib/iron-session";
import { BusinessProfile } from "./schema";

interface CreateBusinessProfileRequest {
  business_name: string;
  business_description: string;
  contact_email: string;
  contact_phone: string;
  logo_url?: string;
}

export async function createBusinessProfile(
  data: CreateBusinessProfileRequest
): Promise<BusinessProfile> {
  try {
    const session = await getSession();

    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }

    const response = await fetch(
      `${process.env.SERVER_API_URL}/business-profile`,
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
      throw new Error(
        errorData?.message || "Failed to create business profile"
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
