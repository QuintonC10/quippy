import React from 'react';
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Quippy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>The Quippy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Segoe+UI:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['Segoe_UI',sans-serif]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
