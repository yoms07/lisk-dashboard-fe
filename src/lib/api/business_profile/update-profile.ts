"use server";

import { getSession } from "@/lib/iron-session";
import { BusinessProfile } from "./schema";

interface UpdateBusinessProfileData {
  business_name: string;
  contact_email: string;
  contact_phone: string;
  business_description: string;
}

export async function updateBusinessProfile(
  businessProfileId: string,
  data: UpdateBusinessProfileData
): Promise<BusinessProfile> {
  try {
    const session = await getSession();

    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }
    console.log(data);
    console.log(JSON.stringify(data));

    const response = await fetch(
      `${process.env.SERVER_API_URL}/business-profile/${businessProfileId}`,
      {
        method: "PUT",
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
        errorData?.message || "Failed to update business profile"
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
