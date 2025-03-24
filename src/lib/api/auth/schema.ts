import { z } from "zod";

export const sessionSchema = z.object({
  userId: z.string(),
  name: z.string(),
  provider: z.string(),
  emailVerified: z.boolean(),
  email: z.string().email(),
  isActive: z.boolean(),
  issuedAt: z.date(),
  expiresAt: z.date(),
  refreshExpiresAt: z.date().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
});

export const baseResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
});

export const authResponseSchema = baseResponseSchema.extend({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    session: sessionSchema,
  }),
});

export const createOauthUserDto = z.object({
  user: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    image: z.string().url().optional(),
  }),
  account: z.object({
    access_token: z.string().min(1, "Access token is required"),
    token_type: z.string().min(1, "Token type is required"),
    scope: z.string().optional(),
    provider: z.string().min(1, "Provider is required"),
    type: z.string().min(1, "Type is required"),
    providerAccountId: z.string().min(1, "Provider account ID is required"),
  }),
  profile: z.record(z.any()).optional(),
});

export const registerEmailDto = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const verifyOtpDto = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().min(1, "OTP is required"),
});

export const refreshTokenDto = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type Session = z.infer<typeof sessionSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;