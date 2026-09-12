"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getInventory, getStats } from "@/lib/api";
import { FoodItem } from "@/types";

type StatsData = {
  totalItems: number;
  expiringSoon: number;
  recipesCooked: number;
  itemsSaved: number;
};

export default function HomePage() {
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHome() {
      try {
        const [inventoryData, statsData] = await Promise.all([
          getInventory(),
          getStats(),
        ]);

        setInventory(inventoryData);
        setStats(statsData.stats);
      } catch (error) {
        console.error("Failed to load home page:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "430px",
          margin: "0 auto",
          padding: "28px 20px",
        }}
      >
        <p>Loading...</p>
      </main>
    );
  }

  const expiringItems = [...inventory]
    .sort(
      (a, b) =>
        new Date(a.estimatedExpirationDate).getTime() -
        new Date(b.estimatedExpirationDate).getTime()
    )
    .slice(0, 3);

  return (
    <main
      style={{
        maxWidth: "430px",
        margin: "0 auto",
        padding: "24px 20px 40px",
      }}
    >
      {/* Header / future logo or character area */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              margin: 0,
            }}
          >
            Karrot Kitchen
          </h1>

          <p
            style={{
              color: "#888",
              marginTop: "6px",
              marginBottom: 0,
            }}
          >
            Cook what you have. Waste less.
          </p>
        </div>

        {/* Replace this box with designer artwork/logo later */}
        <div
          style={{
            width: "72px",
            height: "72px",
            border: "1px dashed #555",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
            fontSize: "11px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          Image
        </div>
      </section>

      {/* Main summary card */}
      <section
        style={{
          padding: "20px",
          border: "1px solid #333",
          borderRadius: "20px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "20px",
          }}
        >
          Your Fridge
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          <Link
            href="/fridge"
            style={{
              textDecoration: "none",
              color: "inherit",
              padding: "16px",
              border: "1px solid #333",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {stats?.totalItems ?? 0}
            </div>

            <div
              style={{
                color: "#888",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              Items in Fridge
            </div>
          </Link>

          <div
            style={{
              padding: "16px",
              border: "1px solid #333",
              borderRadius: "14px",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {stats?.expiringSoon ?? 0}
            </div>

            <div
              style={{
                color: "#888",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              Expiring Soon
            </div>
          </div>
        </div>
      </section>

      {/* Expiring food */}
      <section
        style={{
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              margin: 0,
            }}
          >
            Use These Soon
          </h2>

          <Link
            href="/fridge"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontSize: "13px",
            }}
          >
            View all
          </Link>
        </div>

        {expiringItems.length === 0 ? (
          <div
            style={{
              padding: "20px",
              border: "1px solid #333",
              borderRadius: "16px",
              color: "#888",
            }}
          >
            Nothing in your fridge yet.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {expiringItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px",
                  border: "1px solid #333",
                  borderRadius: "16px",
                }}
              >
                {/* Future food/item image */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    border: "1px dashed #555",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontSize: "10px",
                    flexShrink: 0,
                  }}
                >
                  Image
                </div>

                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <strong>{item.name}</strong>

                  <div
                    style={{
                      color: "#888",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    Expires {item.estimatedExpirationDate}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#888",
                  }}
                >
                  {item.quantity}
                  {item.unit ? ` ${item.unit}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section
        style={{
          marginBottom: "28px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "12px",
          }}
        >
          Quick Actions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          <Link
            href="/scan"
            style={{
              textDecoration: "none",
              color: "inherit",
              padding: "20px 16px",
              border: "1px solid #333",
              borderRadius: "18px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "1px dashed #555",
                borderRadius: "14px",
                margin: "0 auto 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                fontSize: "10px",
              }}
            >
              Icon
            </div>

            Add Groceries
          </Link>

          <Link
            href="/recipes"
            style={{
              textDecoration: "none",
              color: "inherit",
              padding: "20px 16px",
              border: "1px solid #333",
              borderRadius: "18px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "1px dashed #555",
                borderRadius: "14px",
                margin: "0 auto 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#777",
                fontSize: "10px",
              }}
            >
              Icon
            </div>

            Find Recipes
          </Link>
        </div>
      </section>

      {/* Future character / illustration area */}
      <section
        style={{
          minHeight: "120px",
          border: "1px dashed #555",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#777",
          textAlign: "center",
          padding: "20px",
        }}
      >
        Character / illustration area
      </section>
    </main>
  );
}