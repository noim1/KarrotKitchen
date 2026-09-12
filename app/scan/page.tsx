"use client";

import { useState } from "react";
import ReceiptScanner from "@/components/ReceiptScanner";
import ItemScanner from "@/components/ItemScanner";
import { addManualInventoryItem } from "@/lib/api";

type AddMode = "receipt" | "items" | "manual";

type ManualCategory =
  | ""
  | "meat"
  | "dairy"
  | "fruit"
  | "vegetables"
  | "condiments"
  | "staple"
  | "other";

export default function ScanPage() {
  const [mode, setMode] = useState<AddMode>("receipt");

  const [manualItem, setManualItem] = useState("");
  const [manualUnit, setManualUnit] = useState("");
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualCategory, setManualCategory] =
    useState<ManualCategory>("");

  const [addingManual, setAddingManual] = useState(false);
  const [manualMessage, setManualMessage] = useState("");

  async function handleAddGrocery() {
    if (!manualItem.trim()) {
      setManualMessage("Enter a grocery item first.");
      return;
    }

    if (manualQuantity <= 0) {
      setManualMessage("Quantity must be at least 1.");
      return;
    }

    if (!manualCategory) {
      setManualMessage("Select a category.");
      return;
    }

    try {
      setAddingManual(true);
      setManualMessage("");

      await addManualInventoryItem({
        name: manualItem.trim(),
        quantity: manualQuantity,
        unit: manualUnit || undefined,
        category: manualCategory,
      });

      setManualMessage(
        `${manualItem.trim()} added to your fridge!`
      );

      setManualItem("");
      setManualUnit("");
      setManualQuantity(1);
      setManualCategory("");
    } catch (error) {
      console.error("Failed to add grocery:", error);

      setManualMessage(
        error instanceof Error
          ? error.message
          : "Could not add grocery."
      );
    } finally {
      setAddingManual(false);
    }
  }

  const modeButtonStyle = (active: boolean) => ({
    padding: "11px 6px",
    borderRadius: "11px",
    border: "none",
    background: active
      ? "rgba(255,255,255,0.10)"
      : "transparent",
    color: "inherit",
    fontWeight: active ? "700" : "500",
    cursor: "pointer",
    fontSize: "13px",
  });

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #444",
    background: "rgba(255,255,255,0.035)",
    color: "inherit",
    marginBottom: "12px",
    boxSizing: "border-box" as const,
  };

  return (
    <main
      style={{
        maxWidth: "430px",
        margin: "0 auto",
        padding: "28px 20px 40px",
      }}
    >
      <header
        style={{
          marginBottom: "22px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            margin: 0,
          }}
        >
          Add Groceries
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: "6px",
            marginBottom: 0,
          }}
        >
          Choose how you want to add groceries.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
          padding: "5px",
          border: "1px solid #333",
          borderRadius: "16px",
          marginBottom: "22px",
          background: "rgba(255,255,255,0.025)",
        }}
      >
        <button
          type="button"
          onClick={() => setMode("receipt")}
          style={modeButtonStyle(mode === "receipt")}
        >
          Receipt
        </button>

        <button
          type="button"
          onClick={() => setMode("items")}
          style={modeButtonStyle(mode === "items")}
        >
          Items
        </button>

        <button
          type="button"
          onClick={() => setMode("manual")}
          style={modeButtonStyle(mode === "manual")}
        >
          Manual
        </button>
      </div>

      {mode === "receipt" && <ReceiptScanner />}

      {mode === "items" && <ItemScanner />}

      {mode === "manual" && (
        <section
          style={{
            padding: "20px",
            border: "1px solid #333",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.025)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "6px",
              fontSize: "21px",
            }}
          >
            Enter Manually
          </h2>

          <p
            style={{
              color: "#888",
              marginTop: 0,
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            Add an item and a few basic details.
          </p>

          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "6px",
              color: "#aaa",
            }}
          >
            Grocery item
          </label>

          <input
            type="text"
            placeholder="e.g. Milk"
            value={manualItem}
            onChange={(event) =>
              setManualItem(event.target.value)
            }
            style={inputStyle}
          />

          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "6px",
              color: "#aaa",
            }}
          >
            Unit
          </label>

          <select
            value={manualUnit}
            onChange={(event) =>
              setManualUnit(event.target.value)
            }
            style={inputStyle}
          >
            <option value="">Select unit</option>
            <option value="pieces">Pieces</option>
            <option value="bunch">Bunch</option>
            <option value="bag">Bag</option>
            <option value="package">Package</option>
            <option value="container">Container</option>
            <option value="carton">Carton</option>
            <option value="bottle">Bottle</option>
            <option value="can">Can</option>
            <option value="box">Box</option>
            <option value="oz">Ounces (oz)</option>
            <option value="lb">Pounds (lb)</option>
            <option value="g">Grams (g)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>

          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "6px",
              color: "#aaa",
            }}
          >
            Quantity
          </label>

          <input
            type="number"
            min="1"
            value={manualQuantity}
            onChange={(event) =>
              setManualQuantity(Number(event.target.value))
            }
            style={inputStyle}
          />

          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "6px",
              color: "#aaa",
            }}
          >
            Category
          </label>

          <select
            value={manualCategory}
            onChange={(event) =>
              setManualCategory(
                event.target.value as ManualCategory
              )
            }
            style={inputStyle}
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="meat">Meat</option>
            <option value="dairy">Dairy</option>
            <option value="fruit">Fruit</option>
            <option value="vegetables">Vegetables</option>
            <option value="condiments">Condiments</option>
            <option value="staple">Staple Foods</option>
            <option value="other">Other</option>
          </select>

          <button
            type="button"
            onClick={handleAddGrocery}
            disabled={addingManual}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              fontSize: "15px",
              fontWeight: "700",
              cursor: addingManual
                ? "not-allowed"
                : "pointer",
              marginTop: "4px",
              opacity: addingManual ? 0.6 : 1,
            }}
          >
            {addingManual
              ? "Adding..."
              : "Add to Fridge"}
          </button>

          {manualMessage && (
            <p
              style={{
                marginTop: "12px",
                marginBottom: 0,
                fontSize: "14px",
              }}
            >
              {manualMessage}
            </p>
          )}
        </section>
      )}
    </main>
  );
}