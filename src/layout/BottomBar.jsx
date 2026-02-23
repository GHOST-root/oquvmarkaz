import { NavLink } from "react-router-dom";

const bottomItems = [
  { name: "Dashboard", path: "/" },
  { name: "Talabalar", path: "/students" },
  { name: "Guruhlar", path: "/groups" },
  { name: "Moliya", path: "/finance" },
];

function BottomBar() {
  return (
    <div className="fixed-bottom bg-dark text-white border-top">
      <div className="d-flex justify-content-around py-2">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `text-decoration-none text-white ${
                isActive ? "fw-bold text-primary" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default BottomBar;