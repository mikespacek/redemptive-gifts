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
              <svg width="192" height="48" viewBox="0 0 250 80" xmlns="http://www.w3.org/2000/svg">
                <g fill="none">
                  {/* Triangle elements */}
                  <polygon fill="#FFFFFF" points="0,0 25,25 0,25"/>
                  <polygon fill="#FFFFFF" points="25,0 0,0 25,25"/>

                  {/* Small square in middle */}
                  <rect fill="#FFFFFF" x="50" y="10" width="10" height="10"/>

                  {/* Text part (union) */}
                  <path d="M10,70 L10,35 L0,35 L0,70 L10,70 Z
                          M30,70 L30,35 L20,35 L20,70 L30,70 Z
                          M50,70 L50,35 L40,35 L40,70 L50,70 Z
                          M70,70 L70,35 L60,35 L60,70 L70,70 Z
                          M90,70 L90,35 L80,35 L80,70 L90,70 Z
                          M110,70 L110,35 L100,35 L100,70 L110,70 Z
                          M130,70 L130,35 L120,35 L120,70 L130,70 Z
                          M150,70 L150,35 L140,35 L140,70 L150,70 Z"
                      fill="#FFFFFF"/>

                  {/* Orange square */}
                  <rect fill="#FF5000" x="160" y="55" width="15" height="15"/>
                </g>
              </svg>
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