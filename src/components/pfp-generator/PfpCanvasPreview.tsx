import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { drawImageCover, drawMissingPlaceholder, loadImage } from "../../lib/canvasCompositor";
import { PFP_EXPORT_SIZE } from "../../lib/constants";

export interface PhotoOffset {
  x: number;
  y: number;
}

interface PfpCanvasPreviewProps {
  photoUrl: string | null;
  frameUrl: string | undefined;
  zoom: number;
  offset: PhotoOffset;
  onOffsetChange: (offset: PhotoOffset) => void;
}

type LoadedImage = HTMLImageElement | "missing" | null;

function useLoadedImage(url: string | undefined | null): LoadedImage {
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

/** Base scale that makes `img` cover a `size`×`size` square. */
function coverScale(img: HTMLImageElement, size: number): number {
  return Math.max(size / img.naturalWidth, size / img.naturalHeight);
}

/** Keeps the panned photo from revealing gaps at the current zoom level. */
export function clampPhotoOffset(offset: PhotoOffset, zoom: number, img: HTMLImageElement | null): PhotoOffset {
  if (!img) return offset;
  const scale = coverScale(img, PFP_EXPORT_SIZE) * zoom;
  const drawWidth = img.naturalWidth * scale;
  const drawHeight = img.naturalHeight * scale;
  const maxX = Math.max(0, (drawWidth - PFP_EXPORT_SIZE) / 2);
  const maxY = Math.max(0, (drawHeight - PFP_EXPORT_SIZE) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, offset.x)),
    y: Math.min(maxY, Math.max(-maxY, offset.y)),
  };
}

export const PfpCanvasPreview = forwardRef<HTMLCanvasElement, PfpCanvasPreviewProps>(
  ({ photoUrl, frameUrl, zoom, offset, onOffsetChange }, forwardedRef) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(forwardedRef, () => canvasRef.current as HTMLCanvasElement);

    const photoImage = useLoadedImage(photoUrl);
    const frameImage = useLoadedImage(frameUrl);

    const draggingRef = useRef(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    // Re-clamp whenever zoom changes (e.g. via the slider) so zooming back out
    // never leaves a gap from an offset that was only valid at the old zoom.
    useEffect(() => {
      if (!photoImage || photoImage === "missing") return;
      const clamped = clampPhotoOffset(offset, zoom, photoImage);
      if (clamped.x !== offset.x || clamped.y !== offset.y) {
        onOffsetChange(clamped);
      }
    }, [zoom, photoImage, offset, onOffsetChange]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      if (photoImage && photoImage !== "missing") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
        ctx.clip();
        const scale = coverScale(photoImage, width) * zoom;
        const drawWidth = photoImage.naturalWidth * scale;
        const drawHeight = photoImage.naturalHeight * scale;
        const dx = width / 2 + offset.x - drawWidth / 2;
        const dy = height / 2 + offset.y - drawHeight / 2;
        ctx.drawImage(photoImage, dx, dy, drawWidth, drawHeight);
        ctx.restore();
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#dff1f5";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#7fb3c2";
        ctx.font = `${width * 0.08}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("", width / 2, height / 2);
        ctx.restore();
      }

      if (frameImage === "missing" && frameUrl) {
        drawMissingPlaceholder(ctx, frameUrl, 0, 0, width, height);
      } else if (frameImage && frameImage !== "missing") {
        drawImageCover(ctx, frameImage, 0, 0, width, height);
      }
    }, [photoImage, frameImage, frameUrl, zoom, offset]);

    const hasDraggablePhoto = photoImage !== null && photoImage !== "missing";

    const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!hasDraggablePhoto) return;
      draggingRef.current = true;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!draggingRef.current || !lastPointRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const canvasScale = canvas.width / rect.width;

      const dx = (e.clientX - lastPointRef.current.x) * canvasScale;
      const dy = (e.clientY - lastPointRef.current.y) * canvasScale;
      lastPointRef.current = { x: e.clientX, y: e.clientY };

      const img = photoImage && photoImage !== "missing" ? photoImage : null;
      onOffsetChange(clampPhotoOffset({ x: offset.x + dx, y: offset.y + dy }, zoom, img));
    };

    const handlePointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      lastPointRef.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    };

    return (
      <canvas
        ref={canvasRef}
        width={PFP_EXPORT_SIZE}
        height={PFP_EXPORT_SIZE}
        style={{ touchAction: "none" }}
        className={`aspect-square w-full max-w-sm touch-none rounded-full border border-white/60 bg-sea-100 shadow-beach select-none ${hasDraggablePhoto ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    );
  },
);

PfpCanvasPreview.displayName = "PfpCanvasPreview";
