import { useRef, useState } from "react";
import { TopBar } from "../components/common/TopBar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { CreatorCarousel } from "../components/header-generator/CreatorCarousel";
import { NameInput } from "../components/header-generator/NameInput";
import { HeaderCanvas } from "../components/header-generator/HeaderCanvas";
import { useAssetStore } from "../context/AssetStoreContext";
import { NAME_BOX } from "../lib/constants";
import { exportCanvas } from "../lib/canvasCompositor";
import type { TextLayer } from "../types/assets";

export function HeaderGeneratorPage() {
  const { creators, activeBackground } = useAssetStore();
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState<{ xNorm: number; yNorm: number }>({
    xNorm: NAME_BOX.xNorm,
    yNorm: NAME_BOX.yNorm,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedCreator = creators.find((c) => c.id === selectedCreatorId);
  const textLayer: TextLayer = { text: name, ...position };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const safeName = name.trim() ? name.trim().replace(/\s+/g, "-") : "header";
      await exportCanvas(canvasRef.current, `Peaks-${safeName}.png`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar backTo="/" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pb-12 sm:px-8 lg:flex-row">
        <div className="lg:flex-[1.4]">
          <HeaderCanvas
            ref={canvasRef}
            backgroundUrl={activeBackground?.imageUrl}
            creatorUrl={selectedCreator?.imageUrl}
            textLayer={textLayer}
            onTextPositionChange={setPosition}
          />
          <p className="mt-2 text-center text-xs text-sea-500 lg:hidden">
            نصيحة: اسحب اسمك مباشرة على الصورة لتغيير موضعه.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-1">
          <Card>
            <h2 className="mb-3 text-sm font-bold tracking-wide text-sea-900 uppercase">
              1. اختر أحد صناع المحتوى
            </h2>
            <CreatorCarousel
              creators={creators}
              selectedId={selectedCreatorId}
              onSelect={setSelectedCreatorId}
            />
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-bold tracking-wide text-sea-900 uppercase">
              2. أضف اسمك
            </h2>
            <NameInput value={name} onChange={setName} />
          </Card>

          <Button
            variant="primary"
            className="w-full py-3 text-base"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? "جارِ التحضير…" : "⬇ تحميل الهيدر"}
          </Button>
        </div>
      </main>
    </div>
  );
}
