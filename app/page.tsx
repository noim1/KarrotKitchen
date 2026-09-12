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
      <header
        style={{
          marginBottom: "3px",
        }}
      >
        
        <img
        src="/images/categories/Title.png"
        alt="Karrot Kitchen"
        style={{
          width: "370px",
          maxWidth: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />

      </header>

      <section
        style={{
          padding: "20px",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          marginBottom: "24px",
          background: "var(--surface)",
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
              border: "1px solid var(--border)",
              borderRadius: "14px",
              background: "var(--surface-soft)",
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
                color: "var(--muted)",
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
              border: "1px solid var(--border)",
              borderRadius: "14px",
              background: "var(--surface-soft)",
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
                color: "var(--muted)",
                fontSize: "13px",
                marginTop: "4px",
              }}
            >
              Expiring Soon
            </div>
          </div>
        </div>
      </section>

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
              border: "1px solid var(--border)",
              borderRadius: "16px",
              color: "var(--muted)",
              background: "var(--surface)",
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
                  padding: "16px",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  background: "var(--surface)",
                }}
              >
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <strong
                    style={{
                      fontSize: "17px",
                    }}
                  >
                    {item.name}
                  </strong>

                  <div
                    style={{
                      color: "var(--muted)",
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
                    color: "var(--muted)",
                    whiteSpace: "nowrap",
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
              padding: "22px 14px",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              textAlign: "center",
              fontWeight: "700",
              fontSize: "16px",
              background: "var(--surface)",
            }}
          >
            Add Groceries
          </Link>

          <Link
            href="/recipes"
            style={{
              textDecoration: "none",
              color: "inherit",
              padding: "22px 14px",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              textAlign: "center",
              fontWeight: "700",
              fontSize: "16px",
              background: "var(--surface)",
            }}
          >
            Find Recipes
          </Link>
        </div>
      </section>
    </main>
  );
}