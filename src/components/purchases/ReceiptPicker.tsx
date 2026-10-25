import { useRef, useState, type DragEvent } from "react";
import { Camera, ImageUp, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/form/FormAlert";
import { prepareReceiptImage, RECEIPT_TYPES } from "@/lib/image";
import { cn } from "@/lib/utils";

/** Take a photo or choose/drop an image. Large photos are shrunk to fit the 5 MB limit. */
export function ReceiptPicker({ onFile }: { onFile: (file: File) => void }) {
  const cameraInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    try {
      onFile(await prepareReceiptImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "That image can't be used.");
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void accept(e.dataTransfer.files[0]);
  };

  return (
    <div className="grid gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "grid justify-items-center rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-ink bg-volt/15" : "border-border bg-card",
        )}
      >
        <span className="grid size-14 place-items-center rounded-2xl bg-volt text-volt-foreground">
          <ScanLine className="size-6" />
        </span>
        <h2 className="mt-5 font-wide text-xl font-extrabold">Snap your receipt</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We'll read the amount, units, token and date. You check them before anything is saved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button size="xl" onClick={() => cameraInput.current?.click()} className="sm:hidden">
            <Camera /> Take a photo
          </Button>
          <Button size="xl" variant="outline" onClick={() => fileInput.current?.click()}>
            <ImageUp /> Choose an image
          </Button>
        </div>
        <p className="mt-4 hidden text-xs text-muted-foreground sm:block">or drop it here · JPEG, PNG, WebP or GIF</p>
      </div>

      {error && <FormAlert>{error}</FormAlert>}

      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          void accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={fileInput}
        type="file"
        accept={RECEIPT_TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          void accept(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
