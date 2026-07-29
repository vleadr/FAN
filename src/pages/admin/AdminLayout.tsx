import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const NAV_ITEMS = [
  { to: "/admin/creators", label: "صناع المحتوى", icon: "🧑‍🎤" },
  { to: "/admin/backgrounds", label: "الخلفيات", icon: "🏝️" },
  { to: "/admin/frames", label: "الإطارات", icon: "🖼️" },
];

export function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-row gap-2 overflow-x-auto border-b border-sea-100 bg-white/70 p-3 md:w-56 md:flex-col md:border-b-0 md:border-e md:p-5">
        <div className="mb-2 hidden px-2 text-lg font-black text-sea-900 md:block">
          PEAKS <span className="font-medium text-sea-500">لوحة التحكم</span>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                isActive ? "bg-sea-900 text-white" : "text-sea-700 hover:bg-sea-100"
              }`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-0 shrink-0 rounded-xl px-3 py-2 text-start text-sm font-semibold text-red-500 hover:bg-red-50 md:mt-auto"
        >
          تسجيل الخروج
        </button>
      </aside>

      <main className="flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
