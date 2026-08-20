const express = require("express");
const cors = require("cors");
const { verifyConnection } = require("./db");
const moviesRouter = require("./routes/movies");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/movies", moviesRouter);

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  verifyConnection()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch(() => {
      console.error("Could not start server — database connection failed.");
    });
}

module.exports = app;
