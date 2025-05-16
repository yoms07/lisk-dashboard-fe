"use server";

import { getSession } from "@/lib/iron-session";
import { PaymentResponse } from "./schema";

export async function getAllPayments(
  businessProfileId: string,
  limit: number,
  page: number
): Promise<PaymentResponse> {
  try {
    const session = await getSession();

    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }

    const response = await fetch(
      `${process.env.SERVER_API_URL}/payment/${businessProfileId}?limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to fetch payments");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
