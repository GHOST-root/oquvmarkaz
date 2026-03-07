import { NavLink } from "react-router-dom";
import { useState } from "react";
import './Sidebar.css'

const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Lidlar", path: "/leads" },
  { name: "Talabalar", path: "/students" },
  { name: "Guruhlar", path: "/groups" },
  { name: "O'qituvchilar", path: "/teachers" },
  { name: "Moliya", path: "/finance",
    children: [
      { name: "BarchaTo'lovlar", path: "/finance/barchasi" },
      { name: "YechibOlish", path: "/finance/withdraw" },
      { name: "Xarajatlar", path: "/finance/xarajatlar" },
      { name: "IshHaqi", path: "/finance/ishhaqi" },
      { name: "Qarzdorlar", path: "/finance/qarzdorlar" },
    ]
   },
  {
    name: "Hisobotlar",
    path: "/reports",
    children: [
      { name: "Darslar", path: "/reports/darslar" },
      // { name: "Qo'ng'iroqlar", path: "/reports/qongiroqlar" },
      { name: "Konversiya", path: "/reports/konversiya" },
      { name: "Lidlar", path: "/reports/lidlar" },
      { name: "SMSlar", path: "/reports/smslar" },
      { name: "TarkEtganlar", path: "/reports/tarketganlar" },
      // { name: "Workly", path: "/reports/workly" },
    ],
  },
  { name: "Kurslar/Xonalar", path: "/courses" },
  { name: "Xodimlar", path: "/staff" },
  {
    name: "Sozlamalar",
    path: "/settings",
    children: [
      { name: "Xonalar", path: "/settings/xonalar" },
      { name: "Bayram Kunlari", path: "/settings/bayram-kunlari" },
      { name: "Arxiv", path: "/settings/arxiv" },
      { name: "Profil", path: "/settings/profil" },
      { name: "Ketgan o'quvchilar", path: "/settings/ketgan-oquvchilar" },
    ],
  },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      style={{
        width: collapsed ? "70px" : "240px",
        transition: "0.3s",
        zIndex: 1050,
      }}
      className="bg-dark text-white vh-100 position-fixed d-flex flex-column sidebar-scroll"
    >
      <div className="p-3 fw-bold border-bottom">
        {collapsed ? "M" : "Markaz"}
      </div>

      <ul className="nav nav-pills flex-column mt-2">

        {menuItems.map((item) => (
          <li className="nav-item" key={item.name}>

            {/* Parent item */}
            <div
              onClick={() =>
                item.children
                  ? setOpenMenu(openMenu === item.name ? null : item.name)
                  : null
              }
            >
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `nav-link text-white ${
                    isActive ? "active bg-primary" : ""
                  }`
                }
              >
                {collapsed ? item.name[0] : item.name}
              </NavLink>
            </div>

            {/* Children */}
            {!collapsed && item.children && openMenu === item.name && (
              <ul className="nav flex-column ms-3">
                {item.children.map((child) => (
                  <li key={child.path}>
                    <NavLink
                      to={child.path}
                      className={({ isActive }) =>
                        `nav-link text-white small ${
                          isActive ? "active bg-secondary" : ""
                        }`
                      }
                    >
                      {child.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}

          </li>
        ))}

      </ul>
    </div>
  );
}

export default Sidebar;