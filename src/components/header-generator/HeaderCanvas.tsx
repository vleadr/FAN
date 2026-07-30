import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  drawImageContain,
  drawImageCover,
  drawMissingPlaceholder,
  loadImage,
} from "../../lib/canvasCompositor";
import {
  CREATOR_OFFSET_X_RATIO,
  CREATOR_TOP_GAP_RATIO,
  HEADER_EXPORT_HEIGHT,
  HEADER_EXPORT_WIDTH,
  NAME_BOX,
  NAME_TEXT_DEFAULTS,
} from "../../lib/constants";
import { useDraggableText } from "../../lib/useDraggable";
import type { TextLayer } from "../../types/assets";

interface HeaderCanvasProps {
  backgroundUrl: string | undefined;
  /** A transparent-background cutout of the selected creator, centered (minus a slight left offset) over the background. */
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

interface BoxRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function getNameBoxRect(canvasWidth: number, canvasHeight: number): BoxRect {
  const width = NAME_BOX.widthRatio * canvasWidth;
  const height = NAME_BOX.heightRatio * canvasHeight;
  return {
    left: NAME_BOX.xNorm * canvasWidth - width / 2,
    top: NAME_BOX.yNorm * canvasHeight - height / 2,
    width,
    height,
  };
}

/** Shrinks the font until `text` fits within `maxWidth`, down to `minSize`. */
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  maxWidth: number,
  startSize: number,
  minSize: number,
): number {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `900 ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minSize;
}

function fittedTextMetrics(ctx: CanvasRenderingContext2D, text: string, box: BoxRect) {
  const maxWidth = box.width * 0.94;
  const startSize = box.height * 0.9;
  const minSize = box.height * 0.32;
  const fontSize = fitFontSize(ctx, text, NAME_TEXT_DEFAULTS.fontFamily, maxWidth, startSize, minSize);
  const width = Math.min(ctx.measureText(text).width, box.width);
  const height = Math.min(fontSize * 1.2, box.height);
  return { fontSize, width, height };
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

      // Creator overlay layer — shifted slightly left of dead-center, scaled down
      // a touch so there's a small gap above their head (stays flush at the bottom)
      const creatorY = height * CREATOR_TOP_GAP_RATIO;
      const creatorH = height * (1 - CREATOR_TOP_GAP_RATIO);
      if (creatorImage === "missing" && creatorUrl) {
        const w = width * 0.4;
        const h = creatorH * 0.9;
        const x = (width - w) / 2 + width * CREATOR_OFFSET_X_RATIO;
        drawMissingPlaceholder(ctx, creatorUrl, x, creatorY + creatorH - h, w, h);
      } else if (creatorImage && creatorImage !== "missing") {
        drawImageContain(ctx, creatorImage, 0, creatorY, width, creatorH, CREATOR_OFFSET_X_RATIO);
      }

      // Name tag: auto-fit bold white RTL text centered inside an invisible
      // fixed box (the box only constrains where the text can be dragged —
      // it isn't drawn).
      if (textLayer.text.trim()) {
        const box = getNameBoxRect(width, height);

        const { fontSize } = fittedTextMetrics(ctx, textLayer.text, box);
        ctx.font = `900 ${fontSize}px ${NAME_TEXT_DEFAULTS.fontFamily}`;
        ctx.direction = "rtl";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const textX = textLayer.xNorm * width;
        const textY = textLayer.yNorm * height;

        // Drop shadow at a 90° angle (straight down), hard-edged, fully opaque —
        // drawn as an explicit second copy of the text rather than via
        // ctx.shadow*, which has a long history of duplicated/ghosted-glyph
        // rendering bugs on iOS Safari.
        ctx.fillStyle = "#000000";
        ctx.fillText(textLayer.text, textX, textY + fontSize * 0.04);

        ctx.fillStyle = NAME_TEXT_DEFAULTS.color;
        ctx.fillText(textLayer.text, textX, textY);
      }
    }, [backgroundImage, creatorImage, backgroundUrl, creatorUrl, textLayer]);

    const hitTest = (canvasX: number, canvasY: number): boolean => {
      const canvas = canvasRef.current;
      if (!canvas || !textLayer.text.trim()) return false;
      const box = getNameBoxRect(canvas.width, canvas.height);
      return (
        canvasX >= box.left &&
        canvasX <= box.left + box.width &&
        canvasY >= box.top &&
        canvasY <= box.top + box.height
      );
    };

    // Keeps the text fully inside the red box — it can be nudged around within
    // it, but never dragged out.
    const clampToBox = (xNorm: number, yNorm: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return { xNorm, yNorm };

      const box = getNameBoxRect(canvas.width, canvas.height);
      const { width: textWidth, height: textHeight } = fittedTextMetrics(ctx, textLayer.text, box);

      const minCenterX = box.left + textWidth / 2;
      const maxCenterX = box.left + box.width - textWidth / 2;
      const minCenterY = box.top + textHeight / 2;
      const maxCenterY = box.top + box.height - textHeight / 2;

      const centerX = Math.min(Math.max(xNorm * canvas.width, minCenterX), maxCenterX);
      const centerY = Math.min(Math.max(yNorm * canvas.height, minCenterY), maxCenterY);

      return { xNorm: centerX / canvas.width, yNorm: centerY / canvas.height };
    };

    const { handlePointerDown, handlePointerMove, handlePointerUp } = useDraggableText({
      getCanvas: () => canvasRef.current,
      hitTest,
      onDrag: (pos) => onTextPositionChange(clampToBox(pos.xNorm, pos.yNorm)),
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
