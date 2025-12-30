const express = require("express");
const cors = require("cors");

const articleRoutes = require("./routes/article.routes");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("BeyondChats Backend Running");
});

// Article routes
app.use("/api/articles", articleRoutes);

module.exports = app;
