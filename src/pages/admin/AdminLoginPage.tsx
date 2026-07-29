import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { TopBar } from "../../components/common/TopBar";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/admin", { replace: true });
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar backTo="/" />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-sm">
          <h1 className="mb-1 text-xl font-bold text-sea-950">تسجيل دخول المشرف</h1>
          <p className="mb-5 text-sm text-sea-600">إدارة صناع المحتوى، الخلفيات، والإطارات.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="كلمة مرور المشرف"
              className={`w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 ${
                error
                  ? "border-red-400 focus:ring-red-200"
                  : "border-sea-200 focus:border-sea-400 focus:ring-sea-200"
              }`}
            />
            {error && <p className="text-xs font-medium text-red-500">كلمة المرور غير صحيحة.</p>}
            <Button type="submit" variant="primary" className="w-full justify-center">
              تسجيل الدخول
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
