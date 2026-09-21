const express = require("express");
const db = require("../db");
const { authMiddleware } = require("./auth");

const router = express.Router();

// GET /api/history — list this user's sort history, newest first
router.get("/", authMiddleware, (req, res) => {
  const rows = db
    .prepare("SELECT * FROM sort_history WHERE user_id = ? ORDER BY id DESC")
    .all(req.user.id);
  res.json(rows);
});

// DELETE /api/history/:id — remove one entry
router.delete("/:id", authMiddleware, (req, res) => {
  const info = db
    .prepare("DELETE FROM sort_history WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.user.id);
  if (info.changes === 0) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

// DELETE /api/history — clear all history for this user
router.delete("/", authMiddleware, (req, res) => {
  db.prepare("DELETE FROM sort_history WHERE user_id = ?").run(req.user.id);
  res.status(204).end();
});

module.exports = router;
