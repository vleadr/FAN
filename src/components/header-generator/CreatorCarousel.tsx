import { ImageWithFallback } from "../common/ImageWithFallback";
import type { Creator } from "../../types/assets";

interface CreatorCarouselProps {
  creators: Creator[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CreatorCarousel({ creators, selectedId, onSelect }: CreatorCarouselProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 text-[11px] font-semibold transition ${selectedId === null
            ? "border-coral-500 bg-coral-50 text-coral-600"
            : "border-sea-200 bg-white text-sea-500 hover:border-sea-300"
          }`}
      >
        <span className="text-xl">-</span>
        بدون
      </button>

      {creators.map((creator) => (
        <button
          key={creator.id}
          type="button"
          onClick={() => onSelect(creator.id)}
          className={`shrink-0 overflow-hidden rounded-2xl border-2 transition ${selectedId === creator.id
              ? "border-coral-500 ring-2 ring-coral-300"
              : "border-sea-200 hover:border-sea-300"
            }`}
        >
          <ImageWithFallback
            src={creator.imageUrl}
            alt={creator.name}
            width={80}
            height={80}
            className="h-20 w-20 object-cover"
          />
          <span className="block truncate bg-white px-1 py-0.5 text-center text-[11px] font-semibold text-sea-800">
            {creator.name}
          </span>
        </button>
      ))}
    </div>
  );
}
