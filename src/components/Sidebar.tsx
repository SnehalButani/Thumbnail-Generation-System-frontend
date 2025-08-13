import { clearToken } from "@/utils/authService";
import { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    href: "/home",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.75z" />
      </svg>
    ),
  },
  {
    name: "Logout",
    href: "/login",
    onClick: () => {
      clearToken();
    },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`h-screen bg-gradient-to-b from-blue-700 to-purple-700 text-white flex flex-col shadow-lg transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}>
      <div className="flex items-center justify-between h-20 border-b border-blue-800 px-4">
        <span className={`text-2xl font-bold tracking-wide transition-all duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>MyApp</span>
        <button
          className="p-2 rounded hover:bg-blue-800 transition-colors"
          onClick={() => setCollapsed((c) => !c)}
        >
          <svg
            className={`h-6 w-6 transform transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>

        </button>
      </div>
      <nav className="flex-1 py-6">
        <ul className={`space-y-2 w-full ${collapsed ? "flex flex-col items-center" : ""}`}>
          {menuItems.map((item) => (
            <li key={item.name} className={`w-full ${collapsed ? "flex justify-center" : ""}`}>
              <Link
                to={item.href}
                onClick={item.onClick}
                className={`flex items-center py-3 rounded-lg transition-all duration-200 group hover:bg-white/10 hover:scale-105 hover:shadow-lg
                  ${collapsed ? "justify-center w-12" : "px-4"}`}
              >
                <span className={`transition-all duration-300 ${collapsed ? "mx-auto" : "mr-4"}`}>{item.icon}</span>
                <span className={`font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

  