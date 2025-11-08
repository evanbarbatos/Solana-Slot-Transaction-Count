"use client";

import { useState } from "react";

export default function HomePage() {
  const [slot, setSlot] = useState<string>("");
  const [result, setResult] = useState<{ slot: number; transactionCount: number } | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    const num = Number(slot);
    if (!Number.isInteger(num) || num < 0) {
      setError("Please enter a valid non-negative block number (slot).");
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";
      const res = await fetch(`${baseUrl}/solana/transaction-count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: num }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Solana Block Transaction Count</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="number"
          inputMode="numeric"
          placeholder="Enter block slot number"
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          style={{ padding: 8, width: 280 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "Querying..." : "Get Count"}
        </button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 12 }}>
          <p><strong>Slot:</strong> {result.slot}</p>
          <p><strong>Transaction Count:</strong> {result.transactionCount}</p>
        </div>
      )}
    </main>
  );
}