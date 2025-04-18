import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./test-globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your Design",
  description: "Discover your spiritual design and how you're uniquely created to impact the world",
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
      </body>
    </html>
  );
}
