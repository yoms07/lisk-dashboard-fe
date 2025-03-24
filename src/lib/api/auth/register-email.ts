"use server";
import { z } from "zod";
import { registerEmailDto } from "./schema";

export async function registerEmail(data: unknown) {
  try {
    const validatedData = registerEmailDto.parse(data);

    const response = await fetch(
      `${process.env.SERVER_API_URL}/auth/register-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      }
    );

    const result = await response.json();

    if (result.status !== 200) {
      throw new Error(result.message || "Registration failed");
    }

    return {
      status: 200,
      message:
        "Registration successful. Please check your email for verification.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        message: "Invalid input data",
        errors: error.errors,
      };
    }

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
