import React from "react";

export default function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    recycle: <><path d="M7 19h10l-2-3"/><path d="M6 6l2-3 2 3"/><path d="M18 6l3 5-3 1"/><path d="M5 12l-2 4 3 3"/><path d="M8 6h6l4 7"/><path d="M16 17H8l-3-5"/></>,
    history: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M4 5 2 8l3 1"/></>,
    impact: <><path d="M12 21V9"/><path d="M12 13c-4-1-7-4-7-9 5 0 8 3 7 9Z"/><path d="M12 17c4-1 7-4 7-9-5 0-8 3-7 9Z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L6 18l.1-.1A1.7 1.7 0 0 0 6.4 16a1.7 1.7 0 0 0-1.6-1H4v-2.4h.8a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L6 9.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V6h2.4v.7a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.8V15h-.8a1.7 1.7 0 0 0-1.6 0Z"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    camera: <><path d="M4 7h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="12" r="3"/></>,
    leaf: <><path d="M20 4C10 4 5 9 5 16c0 2 1 4 3 4 7 0 12-5 12-16Z"/><path d="M4 21c4-6 7-9 12-12"/></>,
    spark: <><path d="m12 2 1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9Z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7Z"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-5"/></>,
    trash: <><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="m6 7 1 13h10l1-13"/><path d="M9 7V4h6v3"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
  };
  return <svg {...p}>{paths[name] || paths.leaf}</svg>;
}
