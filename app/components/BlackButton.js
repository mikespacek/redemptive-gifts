"use client";

import Link from 'next/link';

export default function BlackButton({ href, children }) {
  return (
    <Link 
      href={href}
      style={{
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: '12px 32px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '18px',
        display: 'inline-block',
        textDecoration: 'none',
        border: '1px solid #333',
      }}
    >
      {children}
    </Link>
  );
}
