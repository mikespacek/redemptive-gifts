"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./test-globals.css";
import { Providers } from "./providers";
import { useEffect } from "react";
import { setupErrorHandler } from "./error-handler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Redemptive Gifts Test",
  description: "Discover your dominant redemptive gift based on Arthur Burk's teaching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set up error handler for client-side errors
  useEffect(() => {
    setupErrorHandler();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
