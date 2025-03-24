"use server";
import { sessionSchema, baseResponseSchema } from "./schema";

const sessionResponseDto = baseResponseSchema.extend({
  data: sessionSchema,
});

export async function getServerSession(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.status !== 200) {
      throw new Error(result.message || "Failed to get session");
    }

    const { data: parsedResponse } = sessionResponseDto.safeParse(result);
    if (!parsedResponse) {
      throw new Error("Invalid response from server");
    }

    return {
      status: parsedResponse.status,
      message: parsedResponse.message,
      data: parsedResponse.data,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: 500,
        message: error.message,
      };
    }

    return {
      status: 500,
      message: "An unexpected error occurred",
    };
  }
}
