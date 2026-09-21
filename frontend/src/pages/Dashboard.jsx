import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import SortWaste from "./dashboard/SortWaste.jsx";
import History from "./dashboard/History.jsx";
import Impact from "./dashboard/Impact.jsx";
import Settings from "./dashboard/Settings.jsx";
import { api } from "../api.js";
import Icon from "../components/Icons.jsx";
import { colorFor } from "../categoryColors.js";

function Topbar() {
  const location = useLocation();
  const [q, setQ] = useState("");
  const title = location.pathname.includes("/sort") ? "AI Waste Classification" : location.pathname.includes("/history") ? "Sorting History" : location.pathname.includes("/impact") ? "Environmental Impact" : location.pathname.includes("/settings") ? "Settings" : "Dashboard";
  return <header className="topbar">
    <div className="mobile-title">{title}</div>
    <div className="global-search"><Icon name="search" size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search waste items, tips..." /><span className="search-hint">⌘ K</span></div>
    <div className="top-actions"><button className="icon-btn"><Icon name="bell" size={20}/><span className="notify-dot"/></button><div className="top-user"><div className="avatar-top">NK</div><div><strong>Nitesh Kumar</strong><small>Student</small></div><span>⌄</span></div></div>
  </header>
}

function StatCard({icon, title, value, sub, tone}) { return <div className={`dash-stat ${tone}`}><div className="stat-icon"><Icon name={icon} size={21}/></div><div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>{sub}</small></div></div>; }

function Home() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  useEffect(() => { Promise.all([api.getDashboard(), api.getHistory()]).then(([d,h])=>{setData(d);setHistory(h);}).catch(console.error); }, []);
  const recent = history.slice(0,5);
  const total = data?.total_items || 0;
  const cats = data?.by_category || [];
  const get = name => cats.find(x=>x.category===name)?.count || 0;
  const chart = useMemo(()=>data?.weekly || [],[data]);
  const max = Math.max(1,...chart.map(x=>Math.max(x.recyclable,x.organic,x.ewaste)));

  return <div className="dashboard-home">
    <section className="welcome-banner">
      <div className="welcome-copy"><div className="eyebrow"><span className="live-dot"/> AI-POWERED WASTE SEGREGATION</div><h1>Hi Nitesh! <span>👋</span></h1><p>Turn everyday waste into better choices. Identify, segregate and track your environmental impact with EcoSort AI.</p><Link to="/app/sort" className="hero-btn">Classify Waste <Icon name="arrow" size={17}/></Link></div>
      <div className="hero-art"><img src="/eco-hero.svg" alt="AI waste segregation and recycling"/></div>
    </section>

    <div className="stats-row">
      <StatCard icon="trash" title="Total Items Sorted" value={total} sub="↑ 12% from last week" tone="blue"/>
      <StatCard icon="recycle" title="Recyclable" value={get("Recyclable")} sub={total ? `${Math.round(get("Recyclable")/total*100)}% of total` : "0% of total"} tone="cyan"/>
      <StatCard icon="leaf" title="Organic" value={get("Organic / Compostable")} sub={total ? `${Math.round(get("Organic / Compostable")/total*100)}% of total` : "0% of total"} tone="green"/>
      <StatCard icon="alert" title="E-Waste" value={get("E-Waste")} sub={total ? `${Math.round(get("E-Waste")/total*100)}% of total` : "0% of total"} tone="purple"/>
    </div>

    <div className="dashboard-grid">
      <section className="panel classify-panel">
        <div className="panel-head"><div><h2><Icon name="spark" size={20}/> AI Waste Classification</h2><p>Upload an item or describe it to get an instant segregation recommendation.</p></div><Link to="/app/sort">Open AI <Icon name="arrow" size={15}/></Link></div>
        <Link to="/app/sort" className="dropzone"><div className="upload-orb"><Icon name="upload" size={24}/></div><strong>Drop waste image here</strong><span>or continue with text classification</span><button type="button">Open Classifier</button><small>JPG, PNG • Max 5 MB</small></Link>
        <div className="ai-note"><div><Icon name="spark" size={18}/></div><div><strong>EcoSort AI Engine</strong><p>Classification + disposal guidance + confidence scoring in one workflow.</p></div></div>
      </section>

      <section className="panel recent-panel">
        <div className="panel-head"><div><h2>Recent Classifications</h2><p>Latest items processed by EcoSort AI</p></div><Link to="/app/history">View all <Icon name="arrow" size={15}/></Link></div>
        {recent.length ? <div className="recent-list">{recent.map((r,i)=><div className="recent-row" key={r.id}><div className={`waste-thumb t-${i%5}`}>{r.category.includes("Organic") ? "🍌" : r.category === "E-Waste" ? "🔋" : r.category === "Recyclable" ? "♻️" : r.category.includes("Hazard") ? "⚠️" : "🗑️"}</div><div className="recent-main"><strong>{r.item_name}</strong><span className="badge" style={{color:colorFor(r.category),borderColor:`${colorFor(r.category)}55`}}>{r.category.replace(" / Compostable","")}</span><small>{new Date(r.created_at+"Z").toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</small></div><div className="confidence">{r.confidence}%</div></div>)}</div> : <div className="empty-mini">No classifications yet. Start with your first waste item.</div>}
      </section>

      <section className="panel impact-card"><div className="panel-head"><div><h2><Icon name="leaf" size={20}/> Your Environmental Impact</h2><p>Estimated from your sorted items</p></div></div><div className="impact-metrics"><div><span>CO₂ reduced</span><strong>{(total*0.05).toFixed(1)} kg</strong></div><div><span>Waste diverted</span><strong>{(total*0.12).toFixed(1)} kg</strong></div><div><span>Tree equivalent</span><strong>{Math.max(0,Math.round(total/10))}</strong></div></div><div className="impact-foot">Every correct segregation decision keeps useful material in circulation.</div></section>

      <section className="panel guide-panel"><div className="panel-head"><div><h2>Waste Segregation Guide</h2><p>Know where common waste belongs</p></div><Link to="/app/sort">Guide <Icon name="arrow" size={15}/></Link></div><div className="guide-list"><div><span className="guide-icon organic">🍃</span><b>Organic Waste</b><small>Food scraps, peels, garden waste → Compost</small></div><div><span className="guide-icon recycle">♻</span><b>Recyclable Waste</b><small>Plastic, paper, glass, metal → Recycling bin</small></div><div><span className="guide-icon ewaste">🔋</span><b>E-Waste</b><small>Batteries, electronics, cables → E-waste collection</small></div><div><span className="guide-icon general">🗑</span><b>General Waste</b><small>Soiled paper, sanitary waste → Landfill</small></div></div></section>

      <section className="panel chart-panel"><div className="panel-head"><div><h2>Weekly Sorting Trend</h2><p>Your classification activity • September 2026</p></div><div className="legend"><span><i className="l-blue"/> Recyclable</span><span><i className="l-green"/> Organic</span><span><i className="l-purple"/> E-Waste</span></div></div><div className="chart"><div className="y-axis"><span>{max}</span><span>{Math.round(max/2)}</span><span>0</span></div><div className="bars">{chart.map((d,i)=><div className="bar-group" key={d.day}><div className="bar-stack"><i className="bar blue" style={{height:`${(d.recyclable/max)*100}%`}}/><i className="bar green" style={{height:`${(d.organic/max)*100}%`}}/><i className="bar purple" style={{height:`${(d.ewaste/max)*100}%`}}/></div><small>{d.day}</small></div>)}</div></div></section>
    </div>

    <section className="bottom-banner"><div><span className="eyebrow">SUSTAINABILITY IN ACTION</span><h2>Better segregation. Cleaner planet.</h2><p>Small sorting decisions create measurable environmental impact.</p></div><div className="bottom-art">🌱 ♻️ 🌍</div></section>
  </div>
}

export default function Dashboard() { return <div className="dash-shell"><Sidebar/><main className="dash-main"><Topbar/><div className="dash-content"><Routes><Route index element={<Home/>}/><Route path="sort" element={<SortWaste/>}/><Route path="history" element={<History/>}/><Route path="impact" element={<Impact/>}/><Route path="settings" element={<Settings/>}/><Route path="*" element={<Navigate to="." replace/>}/></Routes></div></main></div>; }
