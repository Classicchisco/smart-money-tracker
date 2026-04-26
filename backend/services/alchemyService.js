const axios = require("axios");
const { ALCHEMY_KEY } = require("../config/env");

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

async function getTransfers(wallet, type) {
  const res = await axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "alchemy_getAssetTransfers",
    params: [
      {
        [type]: wallet,
        category: ["external", "erc20"],
        maxCount: "0x20",
      },
    ],
  });

  return res.data.result.transfers || [];
}

module.exports = { getTransfers };