"use server";

import { getSession } from "@/lib/iron-session";

export async function logout() {
  "use server";
  const session = await getSession();
  // Destroy the session
  await session.destroy();
}
