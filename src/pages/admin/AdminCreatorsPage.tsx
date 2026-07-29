import { Card } from "../../components/common/Card";
import { AssetTable } from "../../components/admin/AssetTable";
import { AssetUploadForm } from "../../components/admin/AssetUploadForm";
import { useAssetStore } from "../../context/AssetStoreContext";

export function AdminCreatorsPage() {
  const { creators, addCreator, deleteCreator } = useAssetStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-sea-950">إدارة صناع المحتوى</h1>
        <p className="text-sm text-sea-600">
          يظهر صناع المحتوى هؤلاء كخيارات قابلة للاختيار في صانع الهيدر، وتُعرض صورة كل صانع
          محتوى في المنتصف فوق الخلفية — لذلك يجب أن تكون الصورة{" "}
          <span className="font-semibold text-sea-800">بدون خلفية (PNG شفاف)</span>.
        </p>
      </div>

      <Card>
        <h2 className="mb-3 text-xs font-bold tracking-wide text-sea-800 uppercase">إضافة صانع محتوى</h2>
        <AssetUploadForm
          nameLabel="اسم صانع المحتوى"
          namePlaceholder="مثال: فيصل"
          submitLabel="إضافة"
          onSubmit={({ name, imageUrl }) => addCreator({ name, imageUrl })}
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-xs font-bold tracking-wide text-sea-800 uppercase">
          صناع المحتوى الحاليون ({creators.length})
        </h2>
        <AssetTable
          rows={creators.map((c) => ({ id: c.id, imageUrl: c.imageUrl, label: c.name }))}
          onDelete={deleteCreator}
          emptyMessage="لا يوجد صناع محتوى بعد — أضف واحدًا أعلاه."
        />
      </Card>
    </div>
  );
}
