const express = require("express");
const db = require("../db");
const { classify } = require("../classifier");
const { authMiddleware } = require("./auth");

const router = express.Router();

// POST /api/classify — classify an item and save it to the user's history
router.post("/", authMiddleware, (req, res) => {
  const { item } = req.body || {};
  if (!item || !String(item).trim()) {
    return res.status(400).json({ error: "item is required" });
  }

  const result = classify(item);

  const info = db
    .prepare(
      `INSERT INTO sort_history (user_id, item_name, category, disposal_tip, reasoning, confidence)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.id, result.item_name, result.category, result.disposal_tip, result.reasoning, result.confidence);

  res.status(201).json({ id: info.lastInsertRowid, ...result });
});

module.exports = router;
