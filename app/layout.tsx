import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bryson Reyes",
  description: "Personal site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen p-4 md:p-6">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
