import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Company Map",
  description: "A lightweight map of product companies that are hiring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
