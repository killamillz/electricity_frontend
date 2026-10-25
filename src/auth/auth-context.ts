import { createContext, useContext } from "react";
import type { components } from "@/api/schema";

export type User = components["schemas"]["User"];

export type AuthStatus = "loading" | "authenticated" | "guest" | "error";

export type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  /** Save the token and user returned by login or register */
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  /** Try loading the current user again after a network error */
  retry: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
};

/** Display name for greetings: first name, else the part of the email before @ */
export const displayName = (user: User) => user.firstName ?? user.email.split("@")[0];

/** "Ada Obi", or the email if no name was given */
export const fullName = (user: User) =>
  [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
