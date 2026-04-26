const express = require("express");
const router = express.Router();
const { getTransfers } = require("../services/alchemyService");

const wallets = [
  "0x564286362092d8e7936f0549571a803b203aaced",
  "0x742d35cc6634c0532925a3b844bc454e4438f44e",
];

const MAX_TX = 20;
const MAX_SINGLE_TX = 50;
const WHALE_THRESHOLD = 20;

router.get("/", async (req, res) => {
  try {
    const results = [];

    for (let wallet of wallets) {
      const incoming = await getTransfers(wallet, "toAddress");
      const outgoing = await getTransfers(wallet, "fromAddress");

      const inTransfers = incoming.slice(0, MAX_TX);
      const outTransfers = outgoing.slice(0, MAX_TX);

      let inflow = 0;
      let outflow = 0;
      let tokenMap = {};

      // 🟢 INCOMING
      for (let t of inTransfers) {
        const val = Number(t.value);

        if (!isNaN(val) && val > 0 && val < MAX_SINGLE_TX) {
          inflow += val;

          const token = t.asset || "ETH";
          if (!tokenMap[token]) tokenMap[token] = 0;
          tokenMap[token] += val;
        }
      }

      // 🔴 OUTGOING
      for (let t of outTransfers) {
        const val = Number(t.value);

        if (!isNaN(val) && val > 0 && val < MAX_SINGLE_TX) {
          outflow += val;

          const token = t.asset || "ETH";
          if (!tokenMap[token]) tokenMap[token] = 0;
          tokenMap[token] -= val;
        }
      }

      let signal = "NEUTRAL ⚪";
      let score = 50;

      if (inflow > outflow) {
        signal = "BUYING 🟢";
        score = 70 + Math.min(inflow, 30);
      } else if (outflow > inflow) {
        signal = "SELLING 🔴";
        score = 30 + Math.min(outflow, 30);
      }

      // 🐋 Whale detection
      let whale = inflow > WHALE_THRESHOLD || outflow > WHALE_THRESHOLD;

      // 🧠 FIND TOP TOKEN
      let topToken = "NONE";
      let topValue = 0;

      for (let token in tokenMap) {
        const val = Math.abs(tokenMap[token]);
        if (val > topValue) {
          topValue = val;
          topToken = token;
        }
      }

      let insight = "No strong activity";

      if (topToken !== "NONE") {
        if (tokenMap[topToken] > 0) {
          insight = `Accumulating ${topToken}`;
        } else {
          insight = `Selling ${topToken}`;
        }
      }

      results.push({
        wallet,
        inflow: inflow.toFixed(4),
        outflow: outflow.toFixed(4),
        signal,
        score,
        whale,
        tokens: tokenMap,
        insight, // 🔥 NEW
      });
    }

    // 🥇 SORT BY SCORE (LEADERBOARD)
    results.sort((a, b) => b.score - a.score);

    res.json(results);

  } catch (err) {
    console.log("ERROR:", err.message);
    res.json([]);
  }
});

module.exports = router;