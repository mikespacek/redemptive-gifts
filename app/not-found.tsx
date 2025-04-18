"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 bg-[#181818] text-white rounded-lg shadow-md max-w-md">
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-6">We couldn't find the page you were looking for.</p>
        <Link
          href="/"
          className="bg-[#F3762F] hover:bg-[#F3762F]/90 text-white font-semibold py-2 px-4 rounded-md inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}