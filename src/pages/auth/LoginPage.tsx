import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import type { z } from "zod";
import { api } from "@/api/client";
import { errorMessage, unwrap } from "@/api/errors";
import { useAuth } from "@/auth/auth-context";
import { loginSchema } from "@/auth/schemas";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormAlert } from "@/components/form/FormAlert";
import { PasswordField } from "@/components/form/PasswordField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextField } from "@/components/form/TextField";
import { TextLink } from "@/components/form/TextLink";

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // GuestOnly redirects once signIn marks the user as logged in
  const login = useMutation({
    mutationFn: (body: LoginValues) => unwrap(api.POST("/auth/login", { body })),
    onSuccess: ({ token, user }) => signIn(token, user),
  });

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to see your bills and record a purchase."
      footer={
        <>
          New here? <TextLink to="/register">Create an account</TextLink>
        </>
      }
    >
      <form className="grid gap-5" onSubmit={handleSubmit((values) => login.mutate(values))} noValidate>
        {login.isError && <FormAlert>{errorMessage(login.error)}</FormAlert>}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="grid gap-2">
          <PasswordField
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Link
            to="/forgot-password"
            className="justify-self-end text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={login.isPending}>Log in</SubmitButton>
      </form>
    </AuthShell>
  );
}
