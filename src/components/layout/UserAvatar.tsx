import type { User } from "@/auth/auth-context";
import { cn } from "@/lib/utils";

const initials = (user: User) => {
  const fromName = [user.firstName, user.lastName].map((part) => part?.trim()[0]).filter(Boolean).join("");
  return (fromName || user.email[0]).toUpperCase();
};

/** Round badge with the user's initials */
export function UserAvatar({ user, className }: { user: User; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-ink font-wide text-xs font-bold text-volt",
        className,
      )}
      aria-hidden
    >
      {initials(user)}
    </span>
  );
}
