import { useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { z } from "zod";
import { api } from "@/api/client";
import { errorMessage, unwrap } from "@/api/errors";
import { resetPasswordSchema } from "@/auth/schemas";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormAlert } from "@/components/form/FormAlert";
import { PasswordField } from "@/components/form/PasswordField";
import { SubmitButton } from "@/components/form/SubmitButton";
import { TextLink } from "@/components/form/TextLink";

type ResetValues = z.infer<typeof resetPasswordSchema>;

/** Opened from the link in the reset email: /reset-password?token=… */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const token = useSearchParams()[0].get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({ resolver: zodResolver(resetPasswordSchema) });

  const reset = useMutation({
    mutationFn: ({ password }: ResetValues) =>
      unwrap(api.POST("/auth/reset-password", { body: { token: token ?? "", password } })),
    onSuccess: ({ message }) => {
      toast.success(message);
      navigate("/login", { replace: true });
    },
  });

  if (!token) {
    return (
      <AuthShell
        title="This link doesn't work"
        footer={<TextLink to="/forgot-password">Request a new reset link</TextLink>}
      >
        <FormAlert>The reset link is incomplete. Open it again from your email, or ask for a new one.</FormAlert>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choose a new password"
      description="You'll use it to log in from now on."
      footer={<TextLink to="/forgot-password">Request a new reset link</TextLink>}
    >
      <form className="grid gap-5" onSubmit={handleSubmit((values) => reset.mutate(values))} noValidate>
        {reset.isError && <FormAlert>{errorMessage(reset.error)}</FormAlert>}
        <PasswordField
          label="New password"
          autoComplete="new-password"
          hint="At least 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <SubmitButton loading={reset.isPending}>Update password</SubmitButton>
      </form>
    </AuthShell>
  );
}
