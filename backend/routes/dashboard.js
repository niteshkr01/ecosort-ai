const express = require("express");
const db = require("../db");
const { authMiddleware } = require("./auth");
const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  const byCategory = db.prepare(`SELECT category, COUNT(*) AS count FROM sort_history WHERE user_id=? GROUP BY category ORDER BY count DESC`).all(req.user.id);
  const total = db.prepare(`SELECT COUNT(*) AS c FROM sort_history WHERE user_id=?`).get(req.user.id).c;
  const recent = db.prepare(`SELECT * FROM sort_history WHERE user_id=? ORDER BY id DESC LIMIT 5`).all(req.user.id);
  const weekly = [];
  for (let i=6;i>=0;i--) {
    const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-i);
    const next = new Date(d); next.setDate(next.getDate()+1);
    const start = d.toISOString().slice(0,19).replace('T',' ');
    const end = next.toISOString().slice(0,19).replace('T',' ');
    const rows = db.prepare(`SELECT category, COUNT(*) AS count FROM sort_history WHERE user_id=? AND created_at>=? AND created_at<? GROUP BY category`).all(req.user.id,start,end);
    const map = Object.fromEntries(rows.map(r=>[r.category,r.count]));
    weekly.push({day:d.toLocaleDateString('en-US',{day:'2-digit',month:'short'}), recyclable:map['Recyclable']||0, organic:map['Organic / Compostable']||0, ewaste:map['E-Waste']||0});
  }
  res.json({total_items:total,by_category:byCategory,recent,weekly});
});
module.exports=router;
