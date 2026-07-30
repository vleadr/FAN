import { useState, type FormEvent } from "react";
import { Button } from "../common/Button";
import { fileToCompressedDataUrl } from "../../lib/fileToDataUrl";

interface AssetUploadFormProps {
  nameLabel: string;
  namePlaceholder: string;
  submitLabel: string;
  onSubmit: (input: { name: string; imageUrl: string }) => void | Promise<void>;
}

export function AssetUploadForm({ nameLabel, namePlaceholder, submitLabel, onSubmit }: AssetUploadFormProps) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selected: File | null) => {
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const imageUrl = await fileToCompressedDataUrl(file);
      await onSubmit({ name: name.trim(), imageUrl });
      setName("");
      handleFileChange(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ ما — حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-sea-700">{nameLabel}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={namePlaceholder}
            className="w-full rounded-lg border border-sea-200 px-3 py-2 text-sm outline-none focus:border-sea-400 focus:ring-2 focus:ring-sea-200"
          />
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold text-sea-700">ملف الصورة</label>
          <div className="flex items-center gap-2">
            {previewUrl && (
              <img
                src={previewUrl}
                alt=""
                width={36}
                height={36}
                decoding="async"
                className="h-9 w-9 rounded object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              className="w-full text-xs file:me-2 file:rounded-full file:border-0 file:bg-sea-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-sea-700"
            />
          </div>
        </div>

        <Button type="submit" variant="secondary" disabled={!name.trim() || !file || isSubmitting}>
          {isSubmitting ? "جارِ الرفع…" : submitLabel}
        </Button>
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </form>
  );
}
