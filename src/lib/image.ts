export const RECEIPT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MAX_BYTES = 5 * 1024 * 1024; // the backend's upload limit
const TARGET_BYTES = 4.5 * 1024 * 1024;
const MAX_SIDE = 2000; // plenty for reading a receipt

/**
 * Phone photos are often over the 5 MB limit. Shrinks large images to a JPEG
 * that fits; small ones are returned unchanged. Throws a readable Error if the
 * file can't be used.
 */
export async function prepareReceiptImage(file: File): Promise<File> {
  if (!RECEIPT_TYPES.includes(file.type)) {
    throw new Error("Use a JPEG, PNG, WebP or GIF photo of the receipt.");
  }
  if (file.size <= TARGET_BYTES) return file;
  if (file.type === "image/gif") throw new Error("That image is over 5 MB. Try a smaller photo.");

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob || blob.size > MAX_BYTES) throw new Error("That image is over 5 MB. Try a smaller photo.");

  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}
