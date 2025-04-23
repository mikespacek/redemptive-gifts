import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./test-globals.css";
import RetryManagerWrapper from "./components/RetryManagerWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your Design",
  description: "Discover your redemptive design and how you're uniquely created to impact the world",
  icons: {
    icon: "/images/union-favicon.png",
    apple: "/images/union-favicon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#181818",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <RetryManagerWrapper />
      </body>
    </html>
  );
}
