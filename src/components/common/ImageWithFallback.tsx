import { useState, type ImgHTMLAttributes } from "react";

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

function filenameOf(src: string): string {
  return src.split("/").pop() ?? src;
}

export function ImageWithFallback({ src, alt, className, ...rest }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center border-2 border-dashed border-sea-400/60 bg-sea-50 p-2 text-center text-[11px] leading-tight text-sea-700 ${className ?? ""}`}
      >
        الملف مفقود:
        <br />
        <span className="font-mono break-all">{filenameOf(src)}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
