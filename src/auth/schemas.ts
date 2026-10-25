import { z } from "zod";

// Same rules as the backend, so most mistakes are caught before a request is sent

const email = z.string().trim().min(1, "Enter your email").pipe(z.email("Enter a valid email address"));

// bcrypt only uses the first 72 bytes of a password
const newPassword = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Use at most 72 characters");

const passwordsMatch = (data: { password: string; confirmPassword: string }) =>
  data.password === data.confirmPassword;
const mismatch = { message: "Passwords don't match", path: ["confirmPassword"] };

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name"),
    lastName: z.string().trim().min(1, "Enter your last name"),
    email,
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine(passwordsMatch, mismatch);

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password: newPassword, confirmPassword: z.string() })
  .refine(passwordsMatch, mismatch);
