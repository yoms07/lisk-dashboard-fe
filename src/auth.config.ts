import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { oauthLogin } from "@/lib/api/auth/login-oauth";

export default {
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const result = await oauthLogin(account?.provider || "", {
          user,
          account,
          profile,
        });
        if (result.status !== 200) {
          console.error("OAuth login failed:", result.message);
          return false;
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
  },
} satisfies NextAuthConfig;
