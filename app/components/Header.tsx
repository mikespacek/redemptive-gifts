"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">Redemptive Gifts Test</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
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
            <button className="p-2 rounded-md hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
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
      className={`px-1 py-2 text-gray-700 hover:text-indigo-600 transition-colors border-b-2 ${
        active ? 'border-indigo-600 text-indigo-600' : 'border-transparent'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header; 