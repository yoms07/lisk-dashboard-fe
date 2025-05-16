"use client";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import TwoColumnLayout from "./two-column-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { OtpVerification } from "@/components/auth/otp-verification";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

type AuthMode = "login" | "register" | "otp";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login"); // Change initial mode to login
  const [email, setEmail] = useState<string>("");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleEmailLogin = (email: string) => {
    setEmail(email);
    setAuthMode("otp");
  };

  const renderAuthComponent = () => {
    switch (authMode) {
      case "login":
        return (
          <UserAuthForm
            onModeChange={() => setAuthMode("register")}
            onEmailLogin={handleEmailLogin}
          />
        );
      case "register":
        return <RegisterForm onModeChange={() => setAuthMode("login")} />;
      case "otp":
        return (
          <OtpVerification
            onModeChange={() => setAuthMode("login")}
            email={email}
          />
        );
      default:
        return (
          <UserAuthForm
            onModeChange={() => setAuthMode("register")}
            onEmailLogin={handleEmailLogin}
          />
        );
    }
  };

  const content = renderAuthComponent();

  return (
    <TwoColumnLayout>
      {isDesktop ? (
        content
      ) : (
        <Card className="mx-2">
          <CardContent>{content}</CardContent>
        </Card>
      )}
    </TwoColumnLayout>
  );
}
