"use server";
import {
  getIronSession,
  IronSession,
  IronSessionData,
  SessionOptions,
} from "iron-session";
import { cookies } from "next/headers";

const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "lisk-pg-session",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const getSession = async (): Promise<IronSession<IronSessionData>> => {
  console.log("GET SESSION");
  const session = await getIronSession<IronSessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
};

declare module "iron-session" {
  interface IronSessionData {
    userId: string;
    name: string;
    provider: string;
    emailVerified: boolean;
    email: string;
    isActive: boolean;
    issuedAt: Date;
    expiresAt: Date;
    refreshExpiresAt?: Date;
    userAgent?: string;
    ipAddress?: string;
    // Additional session properties for tokens
    accessToken?: string;
    refreshToken?: string;
  }
}
