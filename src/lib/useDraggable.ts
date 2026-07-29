import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

interface NormalizedPoint {
  xNorm: number;
  yNorm: number;
}

interface UseDraggableTextArgs {
  getCanvas: () => HTMLCanvasElement | null;
  /** Given a point in canvas-pixel space, whether it falls within the draggable text's bounds. */
  hitTest: (canvasX: number, canvasY: number) => boolean;
  onDrag: (point: NormalizedPoint) => void;
}

/**
 * Unifies mouse/touch/pen dragging of the name text via Pointer Events, mapping
 * screen coordinates to canvas-space (accounting for CSS scaling) and reporting
 * back normalized 0-1 positions so they stay resolution-independent.
 */
export function useDraggableText({ getCanvas, hitTest, onDrag }: UseDraggableTextArgs) {
  const draggingRef = useRef(false);

  const toCanvasPoint = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = getCanvas();
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    [getCanvas],
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const pt = toCanvasPoint(e.clientX, e.clientY);
      if (!pt || !hitTest(pt.x, pt.y)) return;
      draggingRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [toCanvasPoint, hitTest],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      if (!draggingRef.current) return;
      const canvas = getCanvas();
      const pt = toCanvasPoint(e.clientX, e.clientY);
      if (!pt || !canvas) return;
      onDrag({
        xNorm: Math.min(1, Math.max(0, pt.x / canvas.width)),
        yNorm: Math.min(1, Math.max(0, pt.y / canvas.height)),
      });
    },
    [toCanvasPoint, getCanvas, onDrag],
  );

  const handlePointerUp = useCallback((e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
