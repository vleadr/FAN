/** Resolves to null on load failure instead of throwing, so callers can render a fallback. */
export function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function filenameOf(url: string): string {
  return url.split("/").pop() ?? url;
}

/**
 * Draws `img` cover-fit (crop to fill) into the target rect. `focusX`/`focusY`
 * (0-1) bias which part of the source image survives the crop — e.g. 0.42 for
 * `focusY` keeps more headroom below a face than a dead-center 0.5 would.
 */
export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  focusX = 0.5,
  focusY = 0.5,
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const rectRatio = w / h;

  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > rectRatio) {
    sw = img.naturalHeight * rectRatio;
    sx = (img.naturalWidth - sw) * focusX;
  } else {
    sh = img.naturalWidth / rectRatio;
    sy = (img.naturalHeight - sh) * focusY;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/** Draws `img` contain-fit (no crop) centered within the target rect, preserving transparency. */
export function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const rectRatio = w / h;

  let dw = w;
  let dh = h;
  if (imgRatio > rectRatio) {
    dh = w / imgRatio;
  } else {
    dw = h * imgRatio;
  }
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;

  ctx.drawImage(img, dx, dy, dw, dh);
}

/** Visible "asset missing" placeholder drawn directly on the canvas for a given layer. */
export function drawMissingPlaceholder(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.save();
  ctx.fillStyle = "rgba(20, 101, 122, 0.08)";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "rgba(20, 101, 122, 0.5)";
  ctx.lineWidth = Math.max(2, w * 0.002);
  ctx.setLineDash([w * 0.01, w * 0.008]);
  ctx.strokeRect(x + ctx.lineWidth, y + ctx.lineWidth, w - ctx.lineWidth * 2, h - ctx.lineWidth * 2);

  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(10, 39, 51, 0.65)";
  const fontSize = Math.max(12, w * 0.02);
  ctx.font = `${fontSize}px "Cairo", sans-serif`;
  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`الملف مفقود: ${filenameOf(url)}`, x + w / 2, y + h / 2);
  ctx.restore();
}

/** Exports the canvas as a high-quality PNG and triggers a browser download. */
export function exportCanvas(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas export failed"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/png",
      1.0,
    );
  });
}
