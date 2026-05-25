import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus OS — Ecosystem Singularity",
  description: "A decentralized, AI-powered campus management platform with zero operational friction. Real-time event streams, multi-tenant architecture, and cognitive automation.",
  keywords: "campus management, AI, real-time, event-driven, multi-tenant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
