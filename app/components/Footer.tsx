import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Redemptive Gifts Test</h3>
            <p className="text-gray-300">
              Discover your dominant redemptive gift based on Arthur Burk's teaching and understand how you're uniquely designed to impact the world.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/test" className="text-gray-300 hover:text-white transition">Take Test</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-white transition">Admin</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-300">
              This test is based on Arthur Burk's teaching on the redemptive gifts from Romans 12:6-8. It helps identify your primary spiritual design and gifting.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300">
            &copy; {currentYear} Redemptive Gifts Test. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 