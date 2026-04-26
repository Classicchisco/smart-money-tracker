const express = require("express");
const cors = require("cors");

const walletRoutes = require("./routes/walletRoutes");

const app = express();

// ✅ allow frontend later
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Money Tracker API Running");
});

app.use("/api/wallets", walletRoutes);

// 🔥 IMPORTANT: dynamic port (for Railway)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});