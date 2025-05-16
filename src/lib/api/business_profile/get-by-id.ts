import { getSession } from "@/lib/iron-session";
import { businessProfilesResponseSchema, UnauthorizedError } from "./schema";
import { BusinessProfile } from "./schema";

export async function getBusinessProfileById(
  id: string
): Promise<BusinessProfile> {
  try {
    const session = await getSession();

    if (!session.accessToken) {
      throw new UnauthorizedError("Unauthorized: No access token found");
    }

    const response = await fetch(
      `${process.env.SERVER_API_URL}/business-profile/${id}`,
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
      if (response.status === 401) {
        throw new UnauthorizedError(
          errorData?.message || "Unauthorized: Invalid or expired token"
        );
      }
      throw {
        status: response.status,
        message: errorData?.message || "Failed to fetch business profile",
        errorType: "UNKNOWN",
      };
    }

    const result = await response.json();

    const parsedResponse = businessProfilesResponseSchema.safeParse(result);
    if (!parsedResponse.success) {
      throw {
        status: 422,
        message: "Invalid response format from server",
        errorType: "VALIDATION",
      };
    }

    return parsedResponse.data.data[0]; // Assuming the response is an array with a single item
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw {
        status: 503,
        message: "Network error: Unable to reach the server",
        errorType: "NETWORK",
      };
    }

    if (error && typeof error === "object" && "errorType" in error) {
      throw error;
    }

    throw {
      status: 500,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      errorType: "UNKNOWN",
    };
  }
}
