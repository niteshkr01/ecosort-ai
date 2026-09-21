const express = require("express");
const db = require("../db");
const { classify } = require("../classifier");
const { authMiddleware } = require("./auth");

const router = express.Router();

// POST /api/classify
// Supports text classification and image classification.
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { item, image } = req.body || {};

    if (
      (!item || !String(item).trim()) &&
      !image
    ) {
      return res.status(400).json({
        error: "item or image is required",
      });
    }

    // Validate basic image format when provided.
    if (image && typeof image !== "string") {
      return res.status(400).json({
        error: "Invalid image data",
      });
    }

    const result = await classify(
      item ? String(item).trim() : "",
      image || null
    );

    // Save classification result to history.
    const info = db
      .prepare(
        `INSERT INTO sort_history
        (user_id, item_name, category, disposal_tip, reasoning, confidence)
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        req.user.id,
        result.item_name,
        result.category,
        result.disposal_tip,
        result.reasoning,
        result.confidence
      );

    res.status(201).json({
      id: info.lastInsertRowid,
      ...result,
    });
  } catch (error) {
    console.error("Classification route error:", error);

    res.status(500).json({
      error: "AI classification failed",
    });
  }
});

module.exports = router;