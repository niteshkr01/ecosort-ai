import React from "react";
import { Link } from "react-router-dom";
import { CATEGORY_COLORS } from "../categoryColors";

const FEATURES = [
  { icon: "♻️", title: "Instant AI Sorting", desc: "Type any item and get its waste category, disposal tip, and reasoning in real time.", color: CATEGORY_COLORS["Recyclable"] },
  { icon: "🌱", title: "Organic Composting Tips", desc: "Know exactly which kitchen and garden waste can go straight into your compost bin.", color: CATEGORY_COLORS["Organic / Compostable"] },
  { icon: "⚠️", title: "Hazardous Waste Alerts", desc: "Get clear warnings and safe-disposal guidance for chemicals, batteries, and e-waste.", color: CATEGORY_COLORS["Hazardous"] },
  { icon: "🔌", title: "E-Waste Routing", desc: "Locate the right disposal path for electronics instead of tossing them in the trash.", color: CATEGORY_COLORS["E-Waste"] },
  { icon: "📊", title: "Personal Impact Dashboard", desc: "Track how many items you've sorted and see your category-wise environmental impact.", color: "#16a34a" },
  { icon: "🕘", title: "Sorting History", desc: "Every item you've classified is saved so you can revisit past decisions anytime.", color: CATEGORY_COLORS["General / Landfill"] },
];

export default function Landing() {
  return (
    <div>
      <nav className="landing-nav">
        <div className="brand">🌿 EcoSort AI</div>
        <Link to="/login" className="btn btn-primary">Launch App</Link>
      </nav>

      <section className="hero">
        <h1>Sort your waste right, <span>every single time</span>.</h1>
        <p>
          EcoSort AI instantly classifies any household item into Recyclable, Organic,
          Hazardous, or E-Waste — with clear disposal tips and the reasoning behind every call.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ fontSize: "1.05rem", padding: "13px 30px" }}>
          Get Started — It's Free
        </Link>

        <div className="cat-legend">
          {Object.entries(CATEGORY_COLORS).map(([name, color]) => (
            <span className="cat-chip" key={name}>
              <span className="dot" style={{ background: color }} /> {name}
            </span>
          ))}
        </div>
      </section>

      <section className="feature-grid">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title} style={{ "--cat-color": f.color }}>
            <span className="icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        Built by Nitesh Kumar · EcoSort AI · Smart waste classification for a cleaner planet
      </footer>
    </div>
  );
}
