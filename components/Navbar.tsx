"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    icon: "⌂",
    label: "Home",
  },
  {
    href: "/fridge",
    icon: "▣",
    label: "Fridge",
  },
  {
    href: "/scan",
    icon: "+",
    label: "Add",
    center: true,
  },
  {
    href: "/recipes",
    icon: "♨",
    label: "Recipes",
  },
  {
    href: "/profile",
    icon: "♙",
    label: "Profile",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "white",
        borderTop: "1px solid #ddd",
        padding: "8px 12px 12px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: "none",
                color: "black",
                width: "70px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                fontWeight: active ? "700" : "400",
              }}
            >
              <div
                style={{
                  width: link.center ? "52px" : "34px",
                  height: link.center ? "52px" : "34px",
                  borderRadius: link.center ? "50%" : "10px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  fontSize: link.center ? "32px" : "24px",

                  border: active
                    ? "2px solid black"
                    : link.center
                    ? "2px solid black"
                    : "2px solid transparent",

                  marginTop: link.center ? "-28px" : "0",

                  backgroundColor: link.center
                    ? "white"
                    : "transparent",
                }}
              >
                {link.icon}
              </div>

              <span
                style={{
                  fontSize: "12px",
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}