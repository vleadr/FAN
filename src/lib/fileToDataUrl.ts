const MAX_DIMENSION = 1600;

/**
 * Downscales the image to at most `maxDimension` on its longest side before
 * encoding as a PNG data URL. Admin uploads persist to localStorage (no real
 * backend), which has a ~5-10MB per-origin quota — an uncompressed photo
 * straight from a phone/camera can blow past that on its own and silently
 * fail to save, so every upload is capped down first.
 */
export function fileToCompressedDataUrl(file: File, maxDimension = MAX_DIMENSION): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const scale = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("هذا المتصفح لا يدعم معالجة الصور (Canvas غير مدعوم)."));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("تعذّرت قراءة ملف الصورة."));
    };

    img.src = objectUrl;
  });
}
