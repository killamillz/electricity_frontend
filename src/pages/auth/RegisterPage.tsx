import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, UserRound } from "lucide-react";
import type { z } from "zod";
import { api } from "@/api/client";
import { errorMessage, unwrap } from "@/api/errors";
import { useAuth } from "@/auth/auth-context";
import { registerSchema } from "@/auth/schemas";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormAlert } from "@/components/form/FormAlert";
import { PasswordField } from "@/components/form/PasswordField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextField } from "@/components/form/TextField";
import { TextLink } from "@/components/form/TextLink";

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const createAccount = useMutation({
    mutationFn: ({ firstName, lastName, email, password }: RegisterValues) =>
      unwrap(api.POST("/auth/register", { body: { firstName, lastName, email, password } })),
    onSuccess: ({ token, user }) => signIn(token, user),
  });

  return (
    <AuthShell
      title="Create your account"
      description="An admin will set your monthly amount once you've signed up."
      footer={
        <>
          Already have an account? <TextLink to="/login">Log in</TextLink>
        </>
      }
    >
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((values) => createAccount.mutate(values))}
        noValidate
      >
        {createAccount.isError && <FormAlert>{errorMessage(createAccount.error)}</FormAlert>}
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="First name"
            autoComplete="given-name"
            icon={UserRound}
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextField
            label="Last name"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordField
          label="Password"
          autoComplete="new-password"
          hint="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <SubmitButton loading={createAccount.isPending}>Create account</SubmitButton>
      </form>
    </AuthShell>
  );
}
