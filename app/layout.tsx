import React from 'react';
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Quippy - AI-Powered Diagnostics",
  description: "Instantly diagnose and fix computer issues with advanced AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen w-full m-0 p-0 overflow-x-hidden flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
