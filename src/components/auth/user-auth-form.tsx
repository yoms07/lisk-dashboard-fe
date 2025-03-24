"use client";
import { HTMLAttributes, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandFacebook, IconBrandGithub } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { emailLogin } from "@/lib/api/auth/login-email";
import { toast } from "sonner";

// Add to props type
type UserAuthFormProps = HTMLAttributes<HTMLDivElement> & {
  onModeChange: () => void;
  onEmailLogin: (email: string) => void;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

// Update the component
export function UserAuthForm({
  onModeChange,
  onEmailLogin,
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await emailLogin(data);

      if (result.status === 200) {
        toast.success("OTP code has been sent to your email");
        onEmailLogin(data.email);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex flex-col w-full justify-center space-y-6 lg:max-w-xl">
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Login</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and password below to log into your account
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button variant="link" className="px-0 h-auto" asChild>
                      <Link href="/forgot-password">Forgot password?</Link>
                    </Button>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isLoading}>
              Login
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            <IconBrandGithub className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline" type="button" disabled={isLoading}>
            <IconBrandFacebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          By clicking login, you agree to our{" "}
          <Button variant="link" className="px-0 h-auto" asChild>
            <Link href="/terms">Terms of Service</Link>
          </Button>{" "}
          and{" "}
          <Button variant="link" className="px-0 h-auto" asChild>
            <Link href="/privacy">Privacy Policy</Link>
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Button variant="link" className="px-0 h-auto" onClick={onModeChange}>
            Sign up
          </Button>
        </div>
      </CardFooter>
    </div>
  );
}
