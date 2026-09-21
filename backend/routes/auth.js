const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ecosort-dev-secret-change-me";

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "password must be at least 6 characters" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "an account with this email already exists" });
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name, email.toLowerCase(), password_hash);

  const user = { id: info.lastInsertRowid, name, email: email.toLowerCase() };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: "invalid email or password" });
  }

  const user = { id: row.id, name: row.name, email: row.email };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "missing auth token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "invalid or expired token" });
  }
}

module.exports = { router, authMiddleware };
