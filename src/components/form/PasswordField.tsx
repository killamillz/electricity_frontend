import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField, type TextFieldProps } from "./TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "endSlot">;

/** TextField for passwords, with a show/hide toggle */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const ToggleIcon = visible ? EyeOff : Eye;

  return (
    <TextField
      icon={LockKeyhole}
      {...props}
      type={visible ? "text" : "password"}
      endSlot={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          <ToggleIcon />
        </Button>
      }
    />
  );
}
