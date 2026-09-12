"use client";

import { useEffect, useState } from "react";
import { getInventory } from "@/lib/api";
import { FoodItem } from "@/types";

export default function FridgePage() {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInventory() {
      try {
        const items = await getInventory();
        setInventory(items);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load inventory"
        );
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  const groupedInventory = inventory.reduce<FoodItem[]>((acc, item) => {
    const existing = acc.find(
      (existingItem) =>
        existingItem.normalizedName === item.normalizedName &&
        existingItem.unit === item.unit &&
        existingItem.estimatedExpirationDate ===
          item.estimatedExpirationDate
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }

    return acc;
  }, []);

  function getCategoryLabel(category: FoodItem["category"]) {
    switch (category) {
      case "meat":
        return "Meat";
      case "dairy":
        return "Dairy";
      case "fruit":
        return "Fruit";
      case "vegetables":
        return "Vegetables";
      case "condiments":
        return "Condiments";
      case "staple":
        return "Staple Foods";
      case "other":
        return "Other";
      default:
        return "Other";
    }
  }

  function getDaysUntilExpiration(expirationDate: string) {
    const today = new Date();
    const expiration = new Date(expirationDate);

    today.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);

    const difference =
      expiration.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  function getExpirationText(expirationDate: string) {
    const days = getDaysUntilExpiration(expirationDate);

    if (days < 0) {
      return "Expired";
    }

    if (days === 0) {
      return "Expires today";
    }

    if (days === 1) {
      return "Expires tomorrow";
    }

    return `Expires in ${days} days`;
  }

  const sortedInventory = [...groupedInventory].sort(
    (a, b) =>
      new Date(a.estimatedExpirationDate).getTime() -
      new Date(b.estimatedExpirationDate).getTime()
  );

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "430px",
          margin: "0 auto",
          padding: "28px 20px",
        }}
      >
        <p>Loading fridge...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          maxWidth: "430px",
          margin: "0 auto",
          padding: "28px 20px",
        }}
      >
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "430px",
        margin: "0 auto",
        padding: "28px 20px 40px",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "6px",
          }}
        >
          My Fridge
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: 0,
          }}
        >
          {groupedInventory.length}{" "}
          {groupedInventory.length === 1 ? "item" : "items"} in your fridge
        </p>
      </div>

      {sortedInventory.length === 0 ? (
        <div
          style={{
            padding: "28px 20px",
            border: "1px solid #333",
            borderRadius: "18px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            Your fridge is empty
          </h2>

          <p
            style={{
              color: "#888",
              marginBottom: 0,
            }}
          >
            Add groceries by scanning a receipt, taking a photo,
            or entering them manually.
          </p>
        </div>
      ) : (
        sortedInventory.map((item) => {
          const daysUntilExpiration =
            getDaysUntilExpiration(
              item.estimatedExpirationDate
            );

          const isUrgent = daysUntilExpiration <= 1;
          const isSoon =
            daysUntilExpiration > 1 &&
            daysUntilExpiration <= 3;

          return (
            <div
              key={item.id}
              style={{
                padding: "18px",
                marginBottom: "12px",
                border: isUrgent
                  ? "2px solid #b85c5c"
                  : isSoon
                  ? "2px solid #b89b5c"
                  : "1px solid #333",
                borderRadius: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "18px",
                      marginBottom: "5px",
                    }}
                  >
                    {item.name}
                  </strong>

                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "12px",
                      color: "#888",
                      border: "1px solid #444",
                      borderRadius: "999px",
                      padding: "4px 9px",
                    }}
                  >
                    {getCategoryLabel(item.category)}
                  </span>
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    {item.quantity}
                    {item.unit ? ` ${item.unit}` : ""}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid #333",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight:
                      isUrgent || isSoon ? "700" : "400",
                  }}
                >
                  {getExpirationText(
                    item.estimatedExpirationDate
                  )}
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  {item.estimatedExpirationDate}
                </span>
              </div>
            </div>
          );
        })
      )}
    </main>
  );
}