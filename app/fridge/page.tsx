"use client";

import { useEffect, useState } from "react";
import { getInventory } from "@/lib/api";
import { categoryMeta } from "@/lib/icons";
import { FoodItem } from "@/types";
import AppIcon from "@/components/AppIcon";

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

  function getCategory(category: FoodItem["category"]) {
    return categoryMeta[category] ?? categoryMeta.other;
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
      <header
        style={{
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            margin: 0,
          }}
        >
          My Fridge
        </h1>

        <p
          style={{
            color: "var(--muted)",
            marginTop: "6px",
            marginBottom: 0,
          }}
        >
          {groupedInventory.length}{" "}
          {groupedInventory.length === 1 ? "item" : "items"} in your fridge
        </p>
      </header>

      {sortedInventory.length === 0 ? (
        <div
          style={{
            padding: "28px 20px",
            border: "1px solid var(--border)",
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
              color: "var(--muted)",
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

          const category = getCategory(item.category);

          return (
            <article
              key={item.id}
              style={{
                padding: "16px",
                marginBottom: "12px",
                border: isUrgent
                  ? "2px solid #b85c5c"
                  : isSoon
                  ? "2px solid #b89b5c"
                  : "1px solid var(--border)",
                borderRadius: "18px",
                background: "var(--surface)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "18px",
                        lineHeight: 1.25,
                      }}
                    >
                      {item.name}
                    </strong>

                    <strong
                      style={{
                        fontSize: "15px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.quantity}
                      {item.unit ? ` ${item.unit}` : ""}
                    </strong>
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "var(--muted)",
                      border: "1px solid var(--border)",
                      borderRadius: "999px",
                      padding: "4px 9px",
                      marginTop: "8px",
                    }}
                  >
                <AppIcon
                    src={category.src}
                    fallback={category.fallback}
                    alt={category.label}
                    size={20}
                />

                    {category.label}
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--border)",
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
                    color: "var(--muted)",
                  }}
                >
                  {item.estimatedExpirationDate}
                </span>
              </div>
            </article>
          );
        })
      )}
    </main>
  );
}