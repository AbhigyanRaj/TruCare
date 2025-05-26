import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">TruCare</h3>
            <p className="text-gray-600 text-sm">
              Providing quality healthcare solutions for a better tomorrow.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm hover:text-gray-900 cursor-pointer">About Us</li>
              <li className="text-gray-600 text-sm hover:text-gray-900 cursor-pointer">Services</li>
              <li className="text-gray-600 text-sm hover:text-gray-900 cursor-pointer">Contact</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">Email: info@trucare.com</li>
              <li className="text-gray-600 text-sm">Phone: +91 9839293729</li>
              <li className="text-gray-600 text-sm">Address: IIIT Delhi, New Delhi</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} TruCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
