"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppIcon from "@/components/AppIcon";
import { navIcons } from "@/lib/icons";

const links = [
  {
    href: "/",
    label: "Home",
    icon: navIcons.home,
  },
  {
    href: "/fridge",
    label: "Fridge",
    icon: navIcons.fridge,
  },
  {
    href: "/scan",
    label: "Add",
    icon: navIcons.add,
    center: true,
  },
  {
    href: "/recipes",
    label: "Recipes",
    icon: navIcons.recipes,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: navIcons.profile,
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
        backgroundColor: "var(--nav-bg)",
        borderTop: "1px solid var(--nav-border)",
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
                color: active ? "var(--nav-active)" : "var(--foreground)",
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
                  border: active || link.center
                    ? "2px solid var(--nav-active)"
                    : "2px solid transparent",
                  marginTop: link.center ? "-28px" : "0",
                  backgroundColor: link.center
                    ? "var(--accent)"
                    : "transparent",
                  color: link.center ? "var(--accent-text)" : "inherit",
                }}
              >
                <AppIcon
                  src={link.icon.src}
                  fallback={link.icon.fallback}
                  alt={link.label}
                  size={link.center ? 28 : 24}
                />
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
