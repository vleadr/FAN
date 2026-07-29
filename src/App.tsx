import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AssetStoreProvider } from "./context/AssetStoreContext";
import { LandingPage } from "./pages/LandingPage";
import { HeaderGeneratorPage } from "./pages/HeaderGeneratorPage";
import { PfpGeneratorPage } from "./pages/PfpGeneratorPage";

// Dynamically imported, and only ever referenced in dev: this keeps the admin
// panel (and its password check) out of the production bundle entirely, so a
// deployed build has no /admin route at all — not even reachable by URL.
const AdminRoutes = import.meta.env.DEV ? lazy(() => import("./pages/admin/AdminRoutes")) : null;

function App() {
  return (
    <AssetStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/header" element={<HeaderGeneratorPage />} />
          <Route path="/pfp" element={<PfpGeneratorPage />} />

          {AdminRoutes && (
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={null}>
                  <AdminRoutes />
                </Suspense>
              }
            />
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AssetStoreProvider>
  );
}

export default App;
