import { useRef, useState, type DragEvent } from "react";

interface PhotoDropzoneProps {
  onFileSelected: (file: File) => void;
  previewUrl: string | null;
}

export function PhotoDropzone({ onFileSelected, previewUrl }: PhotoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelected(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
        isDragOver ? "border-coral-500 bg-coral-50" : "border-sea-300 bg-white hover:bg-sea-50"
      }`}
    >
      {previewUrl ? (
        <img src={previewUrl} alt="معاينة الصورة المرفوعة" className="h-24 w-24 rounded-full object-cover shadow" />
      ) : (
        <span className="text-4xl">📸</span>
      )}
      <p className="text-sm font-semibold text-sea-800">
        {previewUrl ? "اضغط أو اسحب لاستبدال الصورة" : "اضغط أو اسحب صورتك هنا"}
      </p>
      <p className="text-xs text-sea-500">JPG أو PNG، تُقصّ تلقائيًا إلى دائرة</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
