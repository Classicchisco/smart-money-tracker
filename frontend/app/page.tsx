"use client";
import { useEffect, useState } from "react";

type Wallet = {
  wallet: string;
  inflow: string;
  outflow: string;
  signal: string;
  score: number;
  whale: boolean;
  tokens: Record<string, number>;
  insight: string;
};

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/api/wallets")
        .then((res) => res.json())
        .then((data) => setWallets(data))
        .catch((err) => console.log(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "#e5e7eb",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        🔥 Smart Wallet Leaderboard
      </h1>

      {wallets.map((w, i) => (
        <div
          key={i}
          style={{
            padding: 15,
            marginBottom: 15,
            border: "1px solid #334155",
            borderRadius: 10,
            backgroundColor: "#1e293b",
          }}
        >
          <div><strong>#{i + 1} Wallet</strong></div>
          <div>{w.wallet}</div>

          <div><strong>Score:</strong> {w.score}</div>
          <div><strong>Signal:</strong> {w.signal}</div>
          <div><strong>Insight:</strong> {w.insight}</div>

          {w.whale && (
            <div style={{ color: "#facc15", fontWeight: "bold" }}>
              🐋 Whale Activity
            </div>
          )}

          <div style={{ marginTop: 10 }}>
            <strong>Tokens:</strong>

            {Object.entries(w.tokens).map(([token, value], idx) => (
              <div key={idx}>
                {token}:{" "}
                <span style={{ color: value >= 0 ? "#22c55e" : "#ef4444" }}>
                  {value.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}