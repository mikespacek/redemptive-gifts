"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-[#181818] shadow-custom sticky top-0 z-10 backdrop-blur-sm bg-[#181818]/90 border-b border-gray-800">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-4 max-w-6xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative w-48 h-12">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTc0IiBoZWlnaHQ9IjM0MCIgdmlld0JveD0iMCAwIDU3NCAzNDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM0LjAwMDAwMCwgMzQuMDAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj48cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjAgMCAxMTMuNCAxMTMuNCAwIDExMy40Ij48L3BvbHlnb24+PHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxMTMuNCAwIDAgMCAxMTMuNCAxMTMuNCI+PC9wb2x5Z29uPjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iMjY0LjYgMTEzLjQgMjY0LjYgMTEzLjQgMjY0LjYgMTEzLjQiPjwvcG9seWdvbj48cGF0aCBkPSJNNDkuNSwyNzIuNyBMNDkuNSwxNTEuMiBMMCwxNTEuMiBMMCwyNzIuNyBMNDkuNSwyNzIuNyBaIE0xMTIuNSwyNzIuNyBMMTEyLjUsMTUxLjIgTDYzLDE1MS4yIEw2MywyNzIuNyBMMTEyLjUsMjcyLjcgWiBNMTc1LjUsMjcyLjcgTDE3NS41LDE1MS4yIEwxMjYsMTUxLjIgTDEyNiwyNzIuNyBMMTc1LjUsMjcyLjcgWiBNMjM4LjUsMjcyLjcgTDIzOC41LDE1MS4yIEwxODksMTUxLjIgTDE4OSwyNzIuNyBMMjM4LjUsMjcyLjcgWiBNMzAxLjUsMjcyLjcgTDMwMS41LDE1MS4yIEwyNTIsMTUxLjIgTDI1MiwyNzIuNyBMMzAxLjUsMjcyLjcgWiBNMzY0LjUsMjcyLjcgTDM2NC41LDE1MS4yIEwzMTUsMTUxLjIgTDMxNSwyNzIuNyBMMzY0LjUsMjcyLjcgWiBNNDI3LjUsMjcyLjcgTDQyNy41LDE1MS4yIEwzNzgsMTUxLjIgTDM3OCwyNzIuNyBMNDI3LjUsMjcyLjcgWiBNNDkwLjUsMjcyLjcgTDQ5MC41LDE1MS4yIEw0NDEsMTUxLjIgTDQ0MSwyNzIuNyBMNDkwLjUsMjcyLjcgWiIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPjxyZWN0IGZpbGw9IiNGRjUwMDAiIHg9IjUwNCIgeT0iMjE0LjIiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PC9yZWN0PjwvZz48L2c+PC9zdmc+"
                alt="Union Logo"
                width={192}
                height={48}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>

          <nav className="hidden md:flex space-x-10">
            <NavLink href="/" active={pathname === '/'}>
              Home
            </NavLink>
            <NavLink href="/test" active={pathname === '/test'}>
              Take Test
            </NavLink>
            <NavLink href="/about" active={pathname === '/about'}>
              About
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden py-5 mt-4 border-t border-gray-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-4">
                <MobileNavLink href="/" active={pathname === '/'} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </MobileNavLink>
                <MobileNavLink href="/test" active={pathname === '/test'} onClick={() => setMobileMenuOpen(false)}>
                  Take Test
                </MobileNavLink>
                <MobileNavLink href="/about" active={pathname === '/about'} onClick={() => setMobileMenuOpen(false)}>
                  About
                </MobileNavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ href, active, children }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`px-1 py-2 text-gray-400 hover:text-white transition-all relative group ${
        active ? 'text-white font-medium' : ''
      }`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#F3762F] transform origin-left transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ href, active, children, onClick }: MobileNavLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-5 py-3 rounded-xl transition-all ${
        active
          ? 'bg-[#F3762F] text-white font-medium border border-[#F3762F]'
          : 'text-gray-400 hover:bg-[#F3762F]/20 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;