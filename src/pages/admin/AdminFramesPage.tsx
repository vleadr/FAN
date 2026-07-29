import { Card } from "../../components/common/Card";
import { AssetTable } from "../../components/admin/AssetTable";
import { AssetUploadForm } from "../../components/admin/AssetUploadForm";
import { useAssetStore } from "../../context/AssetStoreContext";

export function AdminFramesPage() {
  const { frames, addFrame, deleteFrame, setActiveFrame } = useAssetStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-sea-950">إدارة الإطارات</h1>
        <p className="text-sm text-sea-600">
          الإطار النشط يُضاف فوق كل صورة شخصية من صانع الصور الشخصية. استخدم صورة PNG شفافة ليظهر
          ما تحتها.
        </p>
      </div>

      <Card>
        <h2 className="mb-3 text-xs font-bold tracking-wide text-sea-800 uppercase">إضافة إطار</h2>
        <AssetUploadForm
          nameLabel="اسم الإطار"
          namePlaceholder="مثال: إطار الصورة الشخصية — البحر الأحمر ٢"
          submitLabel="إضافة"
          onSubmit={({ name, imageUrl }) => addFrame({ label: name, imageUrl })}
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-xs font-bold tracking-wide text-sea-800 uppercase">
          الإطارات ({frames.length})
        </h2>
        <AssetTable
          rows={frames.map((f) => ({
            id: f.id,
            imageUrl: f.imageUrl,
            label: f.label,
            isActive: f.isActive,
          }))}
          onDelete={deleteFrame}
          onSetActive={setActiveFrame}
          emptyMessage="لا توجد إطارات بعد — أضف واحدًا أعلاه."
        />
      </Card>
    </div>
  );
}
