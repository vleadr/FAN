import { ImageWithFallback } from "../common/ImageWithFallback";

interface AssetRow {
  id: string;
  imageUrl: string;
  label: string;
  isActive?: boolean;
}

interface AssetTableProps {
  rows: AssetRow[];
  onDelete: (id: string) => void;
  onSetActive?: (id: string) => void;
  emptyMessage?: string;
}

export function AssetTable({ rows, onDelete, onSetActive, emptyMessage = "لا توجد عناصر بعد." }: AssetTableProps) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-sea-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-start text-sm">
        <thead>
          <tr className="border-b border-sea-200 text-xs tracking-wide text-sea-500 uppercase">
            <th className="py-2 pe-3 font-semibold">معاينة</th>
            <th className="py-2 pe-3 font-semibold">الاسم</th>
            {onSetActive && <th className="py-2 pe-3 font-semibold">الحالة</th>}
            <th className="py-2 pe-3 text-end font-semibold">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-sea-100 last:border-0">
              <td className="py-2 pe-3">
                <ImageWithFallback
                  src={row.imageUrl}
                  alt={row.label}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              </td>
              <td className="py-2 pe-3 font-medium text-sea-900">{row.label}</td>
              {onSetActive && (
                <td className="py-2 pe-3">
                  {row.isActive ? (
                    <span className="rounded-full bg-sea-100 px-2.5 py-1 text-xs font-semibold text-sea-700">
                      نشط
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSetActive(row.id)}
                      className="text-xs font-semibold text-coral-600 hover:underline"
                    >
                      تفعيل
                    </button>
                  )}
                </td>
              )}
              <td className="py-2 pe-3 text-end">
                <button
                  type="button"
                  onClick={() => onDelete(row.id)}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
