import type { Metadata } from 'next';
import './test-globals.css';

export const metadata: Metadata = {
  title: 'Redemptive Gifts Test',
  description: 'A test page for the Redemptive Gifts app',
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-gray-100 p-4">
          <h1 className="text-blue-700">Redemptive Gifts Test</h1>
        </header>
        <main className="p-4">
          <div className="bg-gray-50 p-4 rounded-md">
            {children}
          </div>
          <button className="btn-primary mt-4">
            Test Button
          </button>
        </main>
      </body>
    </html>
  );
} 