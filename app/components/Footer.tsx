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