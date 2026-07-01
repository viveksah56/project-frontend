"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/schema/auth.schema";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IconBrandGithub, IconBrandGoogle, IconLoader2, IconMail } from "@tabler/icons-react";
import authService from "@/services/auth.service";
import { toast } from "sonner";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import Cookies from "js-cookie";
import {setToken, TOKEN_KEY} from "@/lib/token";


type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const rememberValue = watch("remember");

  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const handleRoleBasedRedirect = () => {
    const role = Cookies.get("_userRole");
    toast.success("Logged in successfully");

    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/user/dashboard");
    }
  };
  const onSubmit = async (data: LoginFormData) => {
    try {
     const response = await authService.login(data);
      handleRoleBasedRedirect();
     console.log("Response",response.tokens);

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Invalid email or password.";
      toast.error(errorMessage);
    }
  };

  const handleGoogleAuthSuccess = React.useCallback(
      async (credentialResponse: CredentialResponse) => {
        const idToken = credentialResponse.credential;
        console.log("ID TOKEN", idToken);

        if (!idToken) {
          toast.error("Google login failed. Please try again.");
          return;
        }

        try {
          setIsGoogleLoading(true);
          await authService.loginWithGoogle(idToken);
        } catch (error: any) {
          const errorMessage = error?.message || "Google login failed. Please try again.";
          toast.error(errorMessage);
        } finally {
          setIsGoogleLoading(false);
        }
      },
      [router]
  );

  const handleGithubLogin = React.useCallback(() => {
    toast.info("GitHub login is coming soon.");
  }, []);

  return (
      <Card className="w-full max-w-110 border border-border/40 bg-card/60 backdrop-blur-md shadow-2xl shadow-neutral-950/10 dark:shadow-neutral-950/50 rounded-2xl p-2 sm:p-4">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
            Welcome back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground tracking-wide">
            Enter your credentials below to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email-input" className={cn(errors.email && "text-destructive")}>
                Email address
              </Label>
              <Input
                  {...register("email")}
                  id="email-input"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  placeholder="name@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={cn(
                      "h-10 px-3 bg-background/50 transition-all duration-200 border-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",
                      errors.email && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
                  )}
              />
              {errors.email?.message && (
                  <p id="email-error" role="alert" className="text-xs font-medium text-destructive transition-all">
                    {errors.email.message}
                  </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password-input" className={cn(errors.password && "text-destructive")}>
                  Password
                </Label>
                <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                  {...register("password")}
                  id="password-input"
                  type="password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={cn(
                      "h-10 px-3 bg-background/50 transition-all duration-200 border-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring",
                      errors.password && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
                  )}
              />
              {errors.password?.message && (
                  <p id="password-error" role="alert" className="text-xs font-medium text-destructive transition-all">
                    {errors.password.message}
                  </p>
              )}
            </div>

            <div className="flex items-center space-x-2 py-1">
              <Checkbox
                  id="remember-checkbox"
                  checked={rememberValue}
                  onCheckedChange={(checked) => setValue("remember", checked === true)}
                  disabled={isSubmitting}
                  className="transition-all focus-visible:ring-1"
              />
              <Label
                  htmlFor="remember-checkbox"
                  className="text-sm font-normal text-muted-foreground cursor-pointer select-none"
              >
                Remember me on this device
              </Label>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 font-medium transition-all duration-150 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm gap-2"
            >
              {isSubmitting ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                  <IconMail className="h-4 w-4" />
              )}
              {isSubmitting ? "Signing in..." : "Sign in with Email"}
            </Button>
          </form>
        </CardContent>

        <div className="relative my-4 px-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center px-6">
            <span className="w-full border-t border-border/60" />
          </div>
          <span className="relative bg-card px-3 text-xs text-muted-foreground uppercase tracking-widest font-medium">
          Or continue with
        </span>
        </div>

        <CardFooter className="flex flex-col gap-2.5 pt-2">
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="relative w-full h-10">
              <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting || isGoogleLoading}
                  className="w-full h-10 font-medium bg-background/40 hover:bg-muted/60 transition-colors border-border/60 gap-2"
              >
                {isGoogleLoading ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <IconBrandGoogle className="h-4 w-4 text-muted-foreground" />
                )}
                Google
              </Button>
              <div className="absolute inset-0 opacity-0 [&>div]:w-full [&>div]:h-full [&_iframe]:w-full! [&_iframe]:h-full!">
                <GoogleLogin
                    onSuccess={handleGoogleAuthSuccess}
                    onError={() => toast.error("Google login failed. Please try again.")}
                    width="100%"
                />
              </div>
            </div>
            <Button
                type="button"
                variant="outline"
                onClick={handleGithubLogin}
                disabled={isSubmitting}
                className="w-full h-10 font-medium bg-background/40 hover:bg-muted/60 transition-colors border-border/60 gap-2"
            >
              <IconBrandGithub className="h-4 w-4 text-muted-foreground" />
              GitHub
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-none"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
  );
}

export default LoginForm;