import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);
const YoutubeIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

const Footer = () => {
  const states = [
    'West Bengal', 'Rajasthan', 'Kerala', 'Goa', 'Himachal Pradesh',
    'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Maharashtra'
  ];

  const categories = [
    'Hill Station', 'Beach', 'Heritage', 'Wildlife',
    'Religious', 'Adventure', 'Honeymoon', 'Family Trip'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">India Tourism</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Discover the beauty of India. Explore destinations, plan your trips, and create unforgettable memories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <TwitterIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/states" className="text-gray-400 hover:text-white transition-colors text-sm">All States</Link></li>
              <li><Link href="/places" className="text-gray-400 hover:text-white transition-colors text-sm">Tourist Places</Link></li>
              <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors text-sm">Search</Link></li>
              <li><Link href="/favorites" className="text-gray-400 hover:text-white transition-colors text-sm">Favorites</Link></li>
            </ul>
          </div>

          {/* Popular States */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular States</h3>
            <ul className="space-y-2">
              {states.slice(0, 6).map((state) => (
                <li key={state}>
                  <Link
                    href={`/states/${state.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {state}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/search?category=${encodeURIComponent(category)}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="text-gray-400 text-sm">contact@indiatourism.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <span className="text-gray-400 text-sm">+91 1800-XXX-XXXX</span>
            </div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              &copy; {new Date().getFullYear()} India Tourism. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
