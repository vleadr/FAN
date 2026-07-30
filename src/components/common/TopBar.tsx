import { Link } from "react-router-dom";

export function TopBar({ backTo }: { backTo?: string }) {
  return (
    <header className="flex items-center justify-between px-4 py-4 sm:px-8">
      <Link to="/" className="font-display flex items-center gap-2 text-lg font-black tracking-tight text-sea-900">
        <img
          src="/assets/branding/logo.webp"
          alt="Peaks"
          width={36}
          height={36}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-9 w-9 rounded-full object-cover shadow-sm"
        />
        PEAKS <span className="hidden font-medium text-sea-600 sm:inline"> </span>
      </Link>
      {backTo && (
        <Link
          to={backTo}
          className="rounded-full border border-sea-200 bg-white/70 px-4 py-2 text-sm font-semibold text-sea-800 hover:bg-white"
        >
          رجوع →
        </Link>
      )}
    </header>
  );
}
