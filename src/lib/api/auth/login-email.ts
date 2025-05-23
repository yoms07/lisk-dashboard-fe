"use server";
import { z } from "zod";

const emailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const otpResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    user_id: z.string(),
    expires_at: z.coerce.date(),
    is_used: z.boolean(),
    attempt_count: z.number(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date().optional(),
  }),
});

export type OtpResponse = z.infer<typeof otpResponseDto>;

export async function emailLogin(data: unknown) {
  try {
    const { email, password } = emailLoginSchema.parse(data);

    const response = await fetch(
      `${process.env.SERVER_API_URL}/auth/email/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();

    if (result.statusCode >= 300) {
      throw new Error(result.message || "Login failed");
    }

    const { data: otpResponse, error } = otpResponseDto.safeParse(result);
    console.error(error);
    if (!otpResponse) {
      throw new Error("Invalid response from server");
    }
    return {
      status: 200,
      message: otpResponse?.message,
      data: null,
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
