import { useEffect, useRef, useState } from "react";
import { TopBar } from "../components/common/TopBar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { PhotoDropzone } from "../components/pfp-generator/PhotoDropzone";
import { PfpCanvasPreview, type PhotoOffset } from "../components/pfp-generator/PfpCanvasPreview";
import { useAssetStore } from "../context/AssetStoreContext";
import { exportCanvas } from "../lib/canvasCompositor";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const DEFAULT_OFFSET: PhotoOffset = { x: 0, y: 0 };

export function PfpGeneratorPage() {
  const { activeFrame } = useAssetStore();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState<PhotoOffset>(DEFAULT_OFFSET);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const handleFileSelected = (file: File) => {
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setZoom(MIN_ZOOM);
    setOffset(DEFAULT_OFFSET);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      await exportCanvas(canvasRef.current, "Peaks-Profile-Picture.png");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar backTo="/" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-8 px-4 pb-12 sm:px-8">
        <div className="w-full max-w-sm">
          <PfpCanvasPreview
            ref={canvasRef}
            photoUrl={photoUrl}
            frameUrl={activeFrame?.imageUrl}
            zoom={zoom}
            offset={offset}
            onOffsetChange={setOffset}
          />
          {photoUrl && (
            <p className="mt-2 text-center text-xs text-sea-500">اسحب الصورة لتحديد موضعها</p>
          )}
        </div>

        <Card className="w-full">
          <h2 className="mb-3 text-sm font-bold tracking-wide text-sea-900 uppercase">
            1. ارفع صورتك
          </h2>
          <PhotoDropzone onFileSelected={handleFileSelected} previewUrl={photoUrl} />

          {photoUrl && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-lg">🔍</span>
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-coral-500"
                aria-label="تكبير الصورة"
              />
              <button
                type="button"
                onClick={() => {
                  setZoom(MIN_ZOOM);
                  setOffset(DEFAULT_OFFSET);
                }}
                className="text-xs font-semibold text-sea-600 hover:underline"
              >
                إعادة الضبط
              </button>
            </div>
          )}
        </Card>

        <Button
          variant="primary"
          className="w-full max-w-sm py-3 text-base"
          onClick={handleDownload}
          disabled={isDownloading || !photoUrl}
        >
          {isDownloading ? "جارِ التحضير…" : "⬇ تحميل الصورة الشخصية"}
        </Button>
      </main>
    </div>
  );
}
