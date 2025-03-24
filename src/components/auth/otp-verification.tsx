"use client";
import { HTMLAttributes, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { PinInput, PinInputField } from "@/components/pin-input";
import { verifyOtp } from "@/lib/api/auth/verify-otp";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type OtpVerificationProps = HTMLAttributes<HTMLDivElement> & {
  onModeChange: () => void;
  email?: string;
};

const formSchema = z.object({
  otp: z
    .string()
    .min(1, { message: "Please enter the OTP code" })
    .length(6, { message: "OTP must contain 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export function OtpVerification({ onModeChange, email }: OtpVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await verifyOtp({
        email,
        otp: data.otp,
      });

      if (result.status === 200) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Two-factor authentication
        </h2>

        <p className="text-sm text-muted-foreground">
          Please enter verification code. We have sent a verification code to{" "}
          <span className="font-medium">{email || "your email"}</span>
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <PinInput
                      type="numeric"
                      value={field.value}
                      onChange={field.onChange}
                      otp
                      className="flex gap-2 justify-center"
                    >
                      <PinInputField className="h-12 w-12 text-center text-lg" />
                      <PinInputField className="h-12 w-12 text-center text-lg" />
                      <PinInputField className="h-12 w-12 text-center text-lg" />
                      <PinInputField className="h-12 w-12 text-center text-lg" />
                      <PinInputField className="h-12 w-12 text-center text-lg" />
                      <PinInputField className="h-12 w-12 text-center text-lg" />
                    </PinInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isLoading}>
              Verify
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive a code?{" "}
          <Button
            variant="link"
            className="px-0 h-auto font-normal"
            onClick={() => console.log("Resend code")}
          >
            Resend
          </Button>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Button
            variant="link"
            className="px-0 h-auto font-normal"
            onClick={onModeChange}
          >
            Back to login
          </Button>
        </p>
      </CardFooter>
    </div>
  );
}
