"use client";
import { HTMLAttributes, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandFacebook, IconBrandGithub } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
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
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { registerEmail } from "@/lib/api/auth/register-email";

// Add to props type
type RegisterFormProps = HTMLAttributes<HTMLDivElement> & {
  onModeChange: () => void;
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

// Update the component
export function RegisterForm({
  className,
  onModeChange,
  ...props
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await registerEmail(data);
      
      if (result.status === 200) {
        toast.success(result.message);
        onModeChange(); // Go back to login
      } else {
        toast.error(result.message);
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-2 lg:max-w-xl">
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <div className={cn("grid gap-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
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
                  <FormItem className="space-y-1">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-2" disabled={isLoading}>
                Create account
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>
          </form>
        </Form>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="grow"
            type="button"
            disabled={isLoading}
            onClick={async () => {
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <IconBrandGithub className="h-4 w-4" /> GitHub
          </Button>
          <Button
            variant="outline"
            className="grow"
            type="button"
            disabled={isLoading}
          >
            <IconBrandFacebook className="h-4 w-4" /> Facebook
          </Button>
        </div>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={onModeChange}
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
