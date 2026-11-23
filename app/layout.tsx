import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ConsoleHello from "@/components/ConsoleHello";
import "./globals.css";


const description =
  "Bryson Reyes: CS grad in San Diego who builds things and collects mechanical keyboards. Projects, my current keyboard build, and what I'm listening to.";

export const metadata: Metadata = {
  // makes the generated OG image URL absolute
  metadataBase: new URL("https://brysonreyes.dev"),
  title: {
    default: "Bryson Reyes",
    template: "%s · Bryson Reyes",
  },
  description,
  openGraph: {
    title: "Bryson Reyes",
    description,
    url: "/",
    siteName: "Bryson Reyes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const THEME_SCRIPT = `try {
  var theme = localStorage.getItem("theme");
  if (theme) document.documentElement.dataset.theme = theme;
} catch (e) {}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* applies the saved keycap theme (components/ThemePicker.tsx) before
            first load, so there's no flash of the default colors */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen p-4 md:p-6">
        {children}
        <Analytics />
        <SpeedInsights />
        <ConsoleHello />
      </body>
    </html>
  );
}
