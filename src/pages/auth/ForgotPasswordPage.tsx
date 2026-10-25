import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import type { z } from "zod";
import { api } from "@/api/client";
import { errorMessage, unwrap } from "@/api/errors";
import { forgotPasswordSchema } from "@/auth/schemas";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormAlert } from "@/components/form/FormAlert";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextField } from "@/components/form/TextField";
import { TextLink } from "@/components/form/TextLink";

type ForgotValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const requestLink = useMutation({
    mutationFn: (body: ForgotValues) => unwrap(api.POST("/auth/forgot-password", { body })),
  });

  const footer = (
    <>
      Remembered it? <TextLink to="/login">Back to log in</TextLink>
    </>
  );

  if (requestLink.isSuccess) {
    return (
      <AuthShell title="Check your email" footer={footer}>
        <FormAlert tone="success">
          If an account exists for <strong>{getValues("email")}</strong>, we've sent a link to reset the
          password. It works once and expires in 30 minutes.
        </FormAlert>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      description="Enter the email you signed up with and we'll send you a reset link."
      footer={footer}
    >
      <form
        className="grid gap-5"
        onSubmit={handleSubmit((values) => requestLink.mutate(values))}
        noValidate
      >
        {requestLink.isError && <FormAlert>{errorMessage(requestLink.error)}</FormAlert>}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <SubmitButton loading={requestLink.isPending}>Send reset link</SubmitButton>
      </form>
    </AuthShell>
  );
}
