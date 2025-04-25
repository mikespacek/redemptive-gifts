import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#181818] text-white py-12 mt-16 border-t border-gray-800">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-5">
              <div className="relative w-48 h-12 mb-3">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTc0IiBoZWlnaHQ9IjM0MCIgdmlld0JveD0iMCAwIDU3NCAzNDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM0LjAwMDAwMCwgMzQuMDAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj48cG9seWdvbiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjAgMCAxMTMuNCAxMTMuNCAwIDExMy40Ij48L3BvbHlnb24+PHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxMTMuNCAwIDAgMCAxMTMuNCAxMTMuNCI+PC9wb2x5Z29uPjxwb2x5Z29uIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iMjY0LjYgMTEzLjQgMjY0LjYgMTEzLjQgMjY0LjYgMTEzLjQiPjwvcG9seWdvbj48cGF0aCBkPSJNNDkuNSwyNzIuNyBMNDkuNSwxNTEuMiBMMCwxNTEuMiBMMCwyNzIuNyBMNDkuNSwyNzIuNyBaIE0xMTIuNSwyNzIuNyBMMTEyLjUsMTUxLjIgTDYzLDE1MS4yIEw2MywyNzIuNyBMMTEyLjUsMjcyLjcgWiBNMTc1LjUsMjcyLjcgTDE3NS41LDE1MS4yIEwxMjYsMTUxLjIgTDEyNiwyNzIuNyBMMTc1LjUsMjcyLjcgWiBNMjM4LjUsMjcyLjcgTDIzOC41LDE1MS4yIEwxODksMTUxLjIgTDE4OSwyNzIuNyBMMjM4LjUsMjcyLjcgWiBNMzAxLjUsMjcyLjcgTDMwMS41LDE1MS4yIEwyNTIsMTUxLjIgTDI1MiwyNzIuNyBMMzAxLjUsMjcyLjcgWiBNMzY0LjUsMjcyLjcgTDM2NC41LDE1MS4yIEwzMTUsMTUxLjIgTDMxNSwyNzIuNyBMMzY0LjUsMjcyLjcgWiBNNDI3LjUsMjcyLjcgTDQyNy41LDE1MS4yIEwzNzgsMTUxLjIgTDM3OCwyNzIuNyBMNDI3LjUsMjcyLjcgWiBNNDkwLjUsMjcyLjcgTDQ5MC41LDE1MS4yIEw0NDEsMTUxLjIgTDQ0MSwyNzIuNyBMNDkwLjUsMjcyLjcgWiIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPjxyZWN0IGZpbGw9IiNGRjUwMDAiIHg9IjUwNCIgeT0iMjE0LjIiIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PC9yZWN0PjwvZz48L2c+PC9zdmc+"
                  alt="Union Logo"
                  width={192}
                  height={48}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Discover your dominant redemptive gift and understand how you're uniquely designed to impact the world.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/test" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  Take Test
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-3 h-3 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  About
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5 text-white">About</h3>
            <p className="text-gray-400 leading-relaxed">
              This test is based on the redemptive gifts from Romans 12:6-8. It helps identify your primary redemptive design and gifting.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-500">
            &copy; {currentYear} Union Houston. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;