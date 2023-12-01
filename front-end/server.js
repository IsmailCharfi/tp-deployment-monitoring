const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

app.get("/api", (req, res) => {
  res.json({ api: process.env.API_PATH || "https://api.todo.charfi.me/" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
