import { NavLink } from "react-router-dom";

const items = [
  { to: "/claims", label: "Claims" },
  { to: "/audit-log", label: "Audit Log" },
  { to: "/batch", label: "Batch" },
  { to: "/system", label: "System" },
];

function TopNav() {
  return (
    <header className="top-nav">
      <div className="brand-block">
        <h1>ClaimTrace AI</h1>
        <p>Dashboard Workspace</p>
      </div>
      <nav className="nav-links" aria-label="Primary">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default TopNav;
