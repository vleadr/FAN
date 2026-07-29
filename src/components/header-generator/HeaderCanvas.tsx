import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  drawImageContain,
  drawImageCover,
  drawMissingPlaceholder,
  loadImage,
} from "../../lib/canvasCompositor";
import { HEADER_EXPORT_HEIGHT, HEADER_EXPORT_WIDTH, NAME_TEXT_DEFAULTS } from "../../lib/constants";
import { useDraggableText } from "../../lib/useDraggable";
import type { TextLayer } from "../../types/assets";

interface HeaderCanvasProps {
  backgroundUrl: string | undefined;
  /** A transparent-background cutout of the selected creator, centered over the background. */
  creatorUrl: string | undefined;
  textLayer: TextLayer;
  onTextPositionChange: (pos: { xNorm: number; yNorm: number }) => void;
}

type LoadedImage = HTMLImageElement | "missing" | null;

function useLoadedImage(url: string | undefined): LoadedImage {
  const [image, setImage] = useState<LoadedImage>(null);

  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }
    let cancelled = false;
    setImage(null);
    loadImage(url).then((img) => {
      if (!cancelled) setImage(img ?? "missing");
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return image;
}

function measureText(ctx: CanvasRenderingContext2D, text: string, fontSize: number) {
  ctx.font = `900 ${fontSize}px ${NAME_TEXT_DEFAULTS.fontFamily}`;
  const metrics = ctx.measureText(text);
  const width = metrics.width;
  const height = fontSize * 1.2;
  return { width, height };
}

export const HeaderCanvas = forwardRef<HTMLCanvasElement, HeaderCanvasProps>(
  ({ backgroundUrl, creatorUrl, textLayer, onTextPositionChange }, forwardedRef) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(forwardedRef, () => canvasRef.current as HTMLCanvasElement);

    const backgroundImage = useLoadedImage(backgroundUrl);
    const creatorImage = useLoadedImage(creatorUrl);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Background layer
      if (backgroundImage === "missing" && backgroundUrl) {
        drawMissingPlaceholder(ctx, backgroundUrl, 0, 0, width, height);
      } else if (backgroundImage && backgroundImage !== "missing") {
        drawImageCover(ctx, backgroundImage, 0, 0, width, height);
      } else {
        ctx.fillStyle = "#bfe6ee";
        ctx.fillRect(0, 0, width, height);
      }

      // Creator overlay layer — centered on top of the background
      if (creatorImage === "missing" && creatorUrl) {
        const w = width * 0.4;
        const h = height * 0.9;
        drawMissingPlaceholder(ctx, creatorUrl, (width - w) / 2, height - h, w, h);
      } else if (creatorImage && creatorImage !== "missing") {
        drawImageContain(ctx, creatorImage, 0, 0, width, height);
      }

      // Name text layer
      if (textLayer.text.trim()) {
        const fontSize = width * NAME_TEXT_DEFAULTS.fontSizeRatio;
        ctx.font = `900 ${fontSize}px ${NAME_TEXT_DEFAULTS.fontFamily}`;
        ctx.fillStyle = NAME_TEXT_DEFAULTS.color;
        ctx.direction = "rtl";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
        ctx.shadowBlur = fontSize * 0.12;
        ctx.shadowOffsetY = fontSize * 0.03;
        ctx.fillText(textLayer.text, textLayer.xNorm * width, textLayer.yNorm * height);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }
    }, [backgroundImage, creatorImage, backgroundUrl, creatorUrl, textLayer]);

    const hitTest = (canvasX: number, canvasY: number): boolean => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !textLayer.text.trim()) return false;

      const fontSize = canvas.width * NAME_TEXT_DEFAULTS.fontSizeRatio;
      const { width, height } = measureText(ctx, textLayer.text, fontSize);
      const cx = textLayer.xNorm * canvas.width;
      const cy = textLayer.yNorm * canvas.height;
      const padding = Math.max(canvas.width * 0.015, 40);

      return (
        canvasX >= cx - width / 2 - padding &&
        canvasX <= cx + width / 2 + padding &&
        canvasY >= cy - height / 2 - padding &&
        canvasY <= cy + height / 2 + padding
      );
    };

    const { handlePointerDown, handlePointerMove, handlePointerUp } = useDraggableText({
      getCanvas: () => canvasRef.current,
      hitTest,
      onDrag: onTextPositionChange,
    });

    return (
      <canvas
        ref={canvasRef}
        width={HEADER_EXPORT_WIDTH}
        height={HEADER_EXPORT_HEIGHT}
        style={{ aspectRatio: `${HEADER_EXPORT_WIDTH} / ${HEADER_EXPORT_HEIGHT}`, touchAction: "none" }}
        className="w-full touch-none rounded-2xl border border-white/60 bg-sea-100 shadow-beach select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    );
  },
);

HeaderCanvas.displayName = "HeaderCanvas";
