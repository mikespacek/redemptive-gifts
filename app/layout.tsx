import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./test-globals.css";
import { Providers } from "./providers";
import ClientErrorHandler from "./components/ClientErrorHandler";

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientErrorHandler />
          {children}
        </Providers>
      </body>
    </html>
  );
}
