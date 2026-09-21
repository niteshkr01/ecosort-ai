import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../App.jsx";
import Icon from "./Icons.jsx";

const NAV_ITEMS = [
  { to: "/app", icon: "dashboard", label: "Dashboard", end: true },
  { to: "/app/sort", icon: "recycle", label: "Classify Waste" },
  { to: "/app/history", icon: "history", label: "History" },
  { to: "/app/impact", icon: "impact", label: "Impact" },
  { to: "/app/settings", icon: "settings", label: "Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };
  const initials = (user?.name || "N").split(" ").map(x => x[0]).slice(0,2).join("").toUpperCase();

  return (
    <aside className="sidebar">
      <div className="brand-wrap">
        <div className="brand-mark"><Icon name="recycle" size={23}/></div>
        <div><div className="brand-name">EcoSort <span>AI</span></div><div className="brand-tag">SMART WASTE • GREENER FUTURE</div></div>
      </div>
      <nav className="side-nav">
        <div className="nav-section-label">WORKSPACE</div>
        {NAV_ITEMS.map(item => <NavLink key={item.to} to={item.to} end={item.end} className={({isActive}) => isActive ? "side-link active" : "side-link"}>
          <Icon name={item.icon} size={19}/><span>{item.label}</span>{item.label === "Classify Waste" && <span className="nav-dot">AI</span>}
        </NavLink>)}
        <button className="side-link logout-link" onClick={handleLogout}><Icon name="logout" size={19}/><span>Logout</span></button>
      </nav>
      <div className="side-bottom">
        <div className="mini-planet"><span>🌍</span><div><strong>Sort today.</strong><small>Protect tomorrow.</small></div></div>
        <div className="user-mini"><div className="avatar-sm">{initials}</div><div><strong>{user?.name || "Nitesh Kumar"}</strong><small>Student • EcoSort AI</small></div></div>
      </div>
    </aside>
  );
}
