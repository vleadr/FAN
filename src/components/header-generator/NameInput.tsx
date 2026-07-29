const MAX_LENGTH = 28;

export function NameInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-sea-800">
        اسمك
      </label>
      <input
        id="name"
        type="text"
        value={value}
        maxLength={MAX_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        placeholder="اكتب اسمك…"
        className="w-full rounded-xl border border-sea-200 bg-white px-4 py-2.5 text-sea-950 shadow-sm outline-none focus:border-sea-400 focus:ring-2 focus:ring-sea-200"
      />
      <p className="mt-1 text-xs text-sea-500">اسحب اسمك على الصورة لتحديد موضعه.</p>
    </div>
  );
}
