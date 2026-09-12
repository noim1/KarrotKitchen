import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChudChomps",
  description: "Smart grocery tracking and recipe recommendations",
  appleWebApp: {
    capable: true,
    title: "ChudChomps",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div
          style={{
            paddingBottom: "100px",
          }}
        >
          {children}
        </div>

        <Navbar />
      </body>
    </html>
  );
}