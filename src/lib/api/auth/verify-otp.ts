"use server";
import { z } from "zod";
import { getSession } from "@/lib/iron-session";
import { verifyOtpDto, authResponseSchema } from "./schema";

export async function verifyOtp(data: unknown) {
  try {
    const validatedData = verifyOtpDto.parse(data);
    const response = await fetch(
      `${process.env.SERVER_API_URL}/auth/verify-otp`,
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
      throw new Error(result.message || "OTP verification failed");
    }

    const { data: parsedResponse } = authResponseSchema.safeParse(result);
    if (!parsedResponse) {
      throw new Error("Invalid response from server");
    }

    const session = await getSession();
    session.email = parsedResponse.data.session.email;
    session.name = parsedResponse.data.session.name;
    session.provider = parsedResponse.data.session.provider;
    session.accessToken = parsedResponse.data.accessToken;
    session.refreshToken = parsedResponse.data.refreshToken;
    await session.save();

    return {
      status: parsedResponse.status,
      message: parsedResponse.message,
      data: {
        session: session,
      },
    };
  } catch (error) {
    console.log(error);
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
