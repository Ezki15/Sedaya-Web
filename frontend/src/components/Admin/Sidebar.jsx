import { useState } from "react";

export default function Sidebar({ activePage, onChangePage }) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "chart" },
    { id: "orders", label: "Orders", icon: "bag" },
    { id: "customers", label: "Customers", icon: "user" },
    { id: "products", label: "Products", icon: "box" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-opacity-30 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Toggle Button (mobile) */}
      <button
        type="button"
        className="inline-flex items-center text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-60 h-screen transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        {/* Header */}
        <div className="flex pl-4 py-6 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <img
              src="/Daun.png"
              alt="Logo"
              className="h-10 w-10 rounded-full bg-gray-200 shadow"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Sedaya
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onChangePage(item.id)}
                  className={`flex w-full items-center rounded-lg group pl-3 py-2 text-left ${
                    activePage === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              </li>
            ))}

            {/* Logout */}
            <li>
              <a
                href="/logout"
                className="flex items-center p-2 pl-0 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
