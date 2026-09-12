"use client";

import { useState } from "react";
import ReceiptScanner from "@/components/ReceiptScanner";
import ItemScanner from "@/components/ItemScanner";

type AddMode = "receipt" | "items" | "manual";

export default function ScanPage() {
  const [mode, setMode] = useState<AddMode>("receipt");

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <h1>Add Groceries</h1>

      <p style={{ color: "#666" }}>
        Choose how you want to add groceries.
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => setMode("receipt")}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border:
              mode === "receipt"
                ? "2px solid black"
                : "1px solid #ccc",
            fontWeight: mode === "receipt" ? "600" : "400",
            cursor: "pointer",
          }}
        >
          Scan Receipt
        </button>

        <button
          type="button"
          onClick={() => setMode("items")}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border:
              mode === "items"
                ? "2px solid black"
                : "1px solid #ccc",
            fontWeight: mode === "items" ? "600" : "400",
            cursor: "pointer",
          }}
        >
          Scan Items
        </button>

        <button
          type="button"
          onClick={() => setMode("manual")}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border:
              mode === "manual"
                ? "2px solid black"
                : "1px solid #ccc",
            fontWeight: mode === "manual" ? "600" : "400",
            cursor: "pointer",
          }}
        >
          Enter Manually
        </button>
      </div>

      {mode === "receipt" && <ReceiptScanner />}

      {mode === "items" && <ItemScanner />}

      {mode === "manual" && (
        <div
          style={{
            padding: "24px",
            border: "1px solid #ddd",
            borderRadius: "16px",
          }}
        >
          <h2>Enter Groceries Manually</h2>

          <p style={{ color: "#666" }}>
            Type the grocery item you want to add.
          </p>

          <input
            type="text"
            placeholder="Example: milk"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="button"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Add Grocery
          </button>
        </div>
      )}
    </main>
  );
}