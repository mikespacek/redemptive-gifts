import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#181818] text-white py-12 mt-16 border-t border-gray-800">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-5 text-white">Your Design</h3>
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
            &copy; {currentYear} Your Design. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;