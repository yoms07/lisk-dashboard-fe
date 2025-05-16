import { getSession } from "@/lib/iron-session";
import AuthPage from "./auth-page";
import { redirect } from "next/navigation";

export default async function Auth() {
  const session = await getSession();
  if (session && session.accessToken) {
    redirect("/dashboard");
  }

  return <AuthPage />;
}
