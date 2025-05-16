"use server";
import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/iron-session";

export async function handleAuthError() {
  try {
    // Delete the session first
    await deleteSession();
    redirect("/auth");
  } catch (error) {
    console.error("Failed to logout:", error);
    redirect("/auth");
  }
}
