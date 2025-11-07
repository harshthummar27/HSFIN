import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 md:py-6 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-xs md:text-sm text-gray-600">
            <p className="font-medium" style={{ color: '#0A0908' }}>
              © {currentYear} HSFIN. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs md:text-sm">
            <span className="text-gray-500">Made with</span>
            <span className="text-red-500">❤️</span>
            <span className="text-gray-500">by</span>
            <span className="font-semibold" style={{ color: '#49111c' }}>@Harsh.Patel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

