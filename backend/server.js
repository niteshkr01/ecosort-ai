require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { router: authRouter } = require("./routes/auth");
const classifyRouter = require("./routes/classify");
const historyRouter = require("./routes/history");
const impactRouter = require("./routes/impact");
const dashboardRouter = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "ecosort-ai-backend" }));

app.use("/api/auth", authRouter);
app.use("/api/classify", classifyRouter);
app.use("/api/history", historyRouter);
app.use("/api/impact", impactRouter);
app.use("/api/dashboard", dashboardRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`EcoSort AI backend running on http://localhost:${PORT}`);
});
