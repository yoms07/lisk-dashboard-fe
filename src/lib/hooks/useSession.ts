"use client";

import { useQuery } from "@tanstack/react-query";
import { IronSessionData } from "iron-session";

async function fetchSession(): Promise<IronSessionData> {
  const response = await fetch("/api/auth/session");
  if (!response.ok) {
    throw new Error("Failed to fetch session");
  }
  return response.json();
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 1, // Only retry once on failure
  });
}
