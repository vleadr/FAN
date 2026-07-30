import { Link } from "react-router-dom";
import { TopBar } from "../components/common/TopBar";

export function LandingPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sand-300/40 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-sea-300/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-full bg-gradient-to-t from-sand-100/80 to-transparent" />
      </div>

      <TopBar />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <img
          src="/assets/headers/Peaks_Header_RedSeaNew.webp"
          alt="صيفية بيكس — البحر الأحمر"
          width={1800}
          height={800}

          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="aspect-[3/1] w-full rounded-3xl object-cover shadow-beach"
        />
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:px-8">
        <div className="mb-3 inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 shadow-sm">
          <img
            src="/assets/branding/logo.webp"
            alt="Peaks"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-lg font-bold text-sea-400">×</span>
          <img
            src="/assets/branding/The-Red-Sea-01.webp"
            alt="The Red Sea — البحر الأحمر"
            width={1920}
            height={600}
            loading="eager"
            decoding="async"
            className="h-20 w-auto object-contain"
          />
        </div>
        <h1 className="font-display text-4xl leading-tight font-black text-sea-950 sm:text-5xl md:text-6xl">
          صيفية <span className="text-coral-500">بيكس</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-sea-700 sm:text-lg">
          تميز بهيدر خاص بك وصورة بروفايل لرحلة البحر الاحمر
        </p>

        <div className="mt-10 grid w-full max-w-3xl gap-6 sm:grid-cols-2">
          <Link
            to="/header"
            className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 text-start shadow-beach transition hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-sea-200/60 transition group-hover:scale-125" />
            <span className="text-5xl"><img src="/assets/branding/header-test.webp" alt="Peaks" width={36} height={36} loading="eager" fetchPriority="high" decoding="async" className="h-20 w-50 rounded-full object-cover shadow-sm" /></span>
            <div>
              <h2 className="text-xl font-bold text-sea-950">إنشاء الهيدر</h2>
              <p className="mt-1 text-sm text-sea-600">
                اختر احد صناع المحتوى واضف اسمك وحمل الهيدر الخاص فيك
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-coral-600">
              ابدأ الإنشاء ←
            </span>
          </Link>

          <Link
            to="/pfp"
            className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 text-start shadow-beach transition hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-coral-200/50 transition group-hover:scale-125" />
            <span className="text-5xl"><img src="/assets/branding/Peaks-Profile-Picture.png" alt="Peaks" width={36} height={36} loading="eager" fetchPriority="high" decoding="async" className="h-30 w-30 rounded-full object-cover shadow-sm" /></span>
            <div>
              <h2 className="text-xl font-bold text-sea-950">إنشاء صورة شخصية</h2>
              <p className="mt-1 text-sm text-sea-600">
                ارفع صورتك وخذ صورة بروفايل بهوية البحر الاحمر
              </p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-coral-600">
              ابدأ الإنشاء ←
            </span>
          </Link>
        </div>
      </main>

      {import.meta.env.DEV && (
        <footer className="px-4 pb-6 text-center text-xs text-sea-500">
          <Link to="/admin" className="hover:underline">
            لوحة التحكم
          </Link>
        </footer>
      )}
    </div>
  );
}
