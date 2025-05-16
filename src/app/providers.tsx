"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { handleAuthError } from "@/lib/utils/auth";
import { toast } from "sonner";

interface ApiError extends Error {
  status?: number;
  errorType?: string;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount: number, error: Error) => {
              const apiError = error as ApiError;
              // Don't retry on authentication errors
              if (
                apiError.name === "UnauthorizedError" ||
                apiError.errorType === "UNAUTHORIZED"
              ) {
                toast.error("Your session has expired. Please log in again.");
                handleAuthError();
                return false;
              }
              // Retry other errors up to 3 times
              return failureCount < 3;
            },
          },
          mutations: {
            retry: (failureCount: number, error: Error) => {
              const apiError = error as ApiError;
              if (
                apiError.name === "UnauthorizedError" ||
                apiError.errorType === "UNAUTHORIZED"
              ) {
                toast.error("Your session has expired. Please log in again.");
                // Add a small delay to ensure the toast is visible
                setTimeout(() => {
                  handleAuthError();
                }, 1000);
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
