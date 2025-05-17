"use server";

import { getSession } from "@/lib/iron-session";
import { CreatePaymentLinkRequest, PaymentLinkDto } from "./schema";

export async function createPaymentLink(
  businessProfileId: string,
  data: CreatePaymentLinkRequest
): Promise<PaymentLinkDto> {
  try {
    const session = await getSession();

    if (!session.accessToken) {
      throw new Error("Unauthorized: No access token found");
    }
    console.log({
      data,
      businessProfileId,
    });

    const response = await fetch(
      `${process.env.SERVER_API_URL}/payment/${businessProfileId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          ...data,
          source: "dashboard", // Set default source to dashboard
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create payment link");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
