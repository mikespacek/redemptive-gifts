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