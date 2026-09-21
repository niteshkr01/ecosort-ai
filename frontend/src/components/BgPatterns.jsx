import React from "react";

// Subtle repeating waste-icon pattern for the auth (login/signup) background.
export function WastePattern() {
  return (
    <svg className="auth-bg-pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <pattern id="wastePattern" width="140" height="140" patternUnits="userSpaceOnUse">
          <g stroke="#a7f3d0" strokeWidth="1.5" fill="none" opacity="0.9">
            {/* recycle arrows */}
            <g transform="translate(15,15)">
              <path d="M10 0 L18 14 L2 14 Z" />
              <circle cx="10" cy="9" r="3" />
            </g>
            {/* bottle */}
            <g transform="translate(70,10)">
              <rect x="4" y="10" width="12" height="22" rx="2" />
              <rect x="7" y="4" width="6" height="7" rx="1" />
            </g>
            {/* battery */}
            <g transform="translate(30,70)">
              <rect x="0" y="4" width="20" height="12" rx="2" />
              <rect x="20" y="8" width="3" height="4" />
              <line x1="6" y1="4" x2="6" y2="16" />
            </g>
            {/* dustbin */}
            <g transform="translate(90,75)">
              <path d="M2 6 L4 26 A2 2 0 0 0 6 28 H14 A2 2 0 0 0 16 26 L18 6 Z" />
              <line x1="0" y1="6" x2="20" y2="6" />
              <line x1="7" y1="2" x2="13" y2="2" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wastePattern)" />
    </svg>
  );
}

// Subtle repeating leaf/greenery pattern for the post-login dashboard background.
export function GreeneryPattern() {
  return (
    <svg className="dash-bg-pattern" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <pattern id="leafPattern" width="120" height="120" patternUnits="userSpaceOnUse">
          <g stroke="#16a34a" strokeWidth="1.4" fill="none">
            <path d="M10 60 C10 40, 30 30, 45 30 C40 45, 30 58, 10 60 Z" />
            <path d="M75 20 C75 5, 90 -2, 100 0 C97 12, 88 20, 75 20 Z" transform="translate(0,10)" />
            <path d="M60 90 C60 75, 75 68, 85 68 C82 80, 73 88, 60 90 Z" />
            <circle cx="100" cy="90" r="4" />
            <circle cx="20" cy="15" r="3" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#leafPattern)" />
    </svg>
  );
}
