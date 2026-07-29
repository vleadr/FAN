import { Card } from "../../components/common/Card";
import { AssetTable } from "../../components/admin/AssetTable";
import { AssetUploadForm } from "../../components/admin/AssetUploadForm";
import { useAssetStore } from "../../context/AssetStoreContext";

export function AdminBackgroundsPage() {
  const { backgrounds, addBackground, deleteBackground, setActiveBackground } = useAssetStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-sea-950">إدارة الخلفيات</h1>
        <p className="text-sm text-sea-600">
          الخلفية النشطة هي التي تظهر افتراضيًا في صانع الهيدر.
        </p>
      </div>

      <Card>
        <h2 className="mb-3 text-xs font-bold tracking-wide text-sea-800 uppercase">إضافة خلفية</h2>
        <AssetUploadForm
          nameLabel="اسم الخلفية"
          namePlaceholder="مثال: هيدر — البحر الأحمر ٢"
          submitLabel="إضافة"
          onSubmit={({ name, imageUrl }) => addBackground({ label: name, imageUrl })}
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-xs font-bold tracking-wide text-sea-800 uppercase">
          الخلفيات ({backgrounds.length})
        </h2>
        <AssetTable
          rows={backgrounds.map((b) => ({
            id: b.id,
            imageUrl: b.imageUrl,
            label: b.label,
            isActive: b.isActive,
          }))}
          onDelete={deleteBackground}
          onSetActive={setActiveBackground}
          emptyMessage="لا توجد خلفيات بعد — أضف واحدة أعلاه."
        />
      </Card>
    </div>
  );
}
