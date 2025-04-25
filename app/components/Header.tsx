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
              <svg width="192" height="48" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                  {/* Triangle elements */}
                  <polygon fill="#FFFFFF" points="0,0 20,20 0,20"/>
                  <polygon fill="#FFFFFF" points="20,0 0,0 20,20"/>

                  {/* Small square in middle */}
                  <rect fill="#FFFFFF" x="40" y="8" width="8" height="8"/>

                  {/* Text part (union) */}
                  <path d="M8,55 L8,30 L0,30 L0,55 L8,55 Z
                          M23,55 L23,30 L15,30 L15,55 L23,55 Z
                          M38,55 L38,30 L30,30 L30,55 L38,55 Z
                          M53,55 L53,30 L45,30 L45,55 L53,55 Z
                          M68,55 L68,30 L60,30 L60,55 L68,55 Z
                          M83,55 L83,30 L75,30 L75,55 L83,55 Z
                          M98,55 L98,30 L90,30 L90,55 L98,55 Z
                          M113,55 L113,30 L105,30 L105,55 L113,55 Z"
                      fill="#FFFFFF"/>

                  {/* Orange square */}
                  <rect fill="#FF5000" x="125" y="45" width="10" height="10"/>
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