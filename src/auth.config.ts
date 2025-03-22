import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
    async jwt(params) {
      console.log("params");
      console.log(params);
      return params.token;
    },
  },
} satisfies NextAuthConfig;
