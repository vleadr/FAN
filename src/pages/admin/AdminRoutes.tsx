import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "../../context/AdminAuthContext";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { AdminLoginPage } from "./AdminLoginPage";
import { AdminLayout } from "./AdminLayout";
import { AdminCreatorsPage } from "./AdminCreatorsPage";
import { AdminBackgroundsPage } from "./AdminBackgroundsPage";
import { AdminFramesPage } from "./AdminFramesPage";

/**
 * Loaded only in local development (see App.tsx) via a dynamic import, so
 * none of this — including the admin password check — ships in the
 * production bundle served to real visitors.
 */
export default function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="creators" replace />} />
          <Route path="creators" element={<AdminCreatorsPage />} />
          <Route path="backgrounds" element={<AdminBackgroundsPage />} />
          <Route path="frames" element={<AdminFramesPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
