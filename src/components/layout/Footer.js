// src/components/layout/Footer.js
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EduCAS</h3>
            <p className="text-gray-300 text-sm">
              Educational Content Analysis System - AI-powered platform for
              adaptive educational content analysis.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/" className="hover:text-green-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/upload" className="hover:text-green-400">
                  Analyze Content
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-green-400">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 text-sm">
              University of Hail
              <br />
              College of Computer Science and Engineering
              <br />
              Email: educas@uoh.edu.sa
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} EduCAS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
