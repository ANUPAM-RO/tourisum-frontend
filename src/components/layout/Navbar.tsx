'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  User,
  Heart,
  LogOut,
  ChevronDown,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/states', label: 'States' },
  { href: '/places', label: 'Places' },
  { href: '/hotels', label: 'Hotels' },
  { href: '/restaurants', label: 'Restaurants' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();

  const isHomePage = pathname === '/';
  const transparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[68px] gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 group-hover:scale-105 ${
                transparent
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-orange-500 to-rose-500 shadow-md shadow-orange-200'
              }`}
            >
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div className="leading-none">
              <span className={`text-[15px] font-bold tracking-tight ${transparent ? 'text-white' : 'text-gray-900'}`}>
                India<span className={transparent ? 'text-orange-300' : 'text-orange-500'}>Tourism</span>
              </span>
              <p className={`text-[9px] font-semibold tracking-[0.15em] uppercase mt-0.5 ${transparent ? 'text-white/55' : 'text-gray-400'}`}>
                Discover India
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? transparent
                        ? 'text-white bg-white/15'
                        : 'text-orange-600 bg-orange-50'
                      : transparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavDot"
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-4 rounded-full ${
                        transparent ? 'bg-white' : 'bg-orange-500'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search + Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Search */}
            <form onSubmit={handleSearch}>
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 ${
                  searchFocused
                    ? 'w-64 border-orange-400 bg-white shadow-[0_0_0_3px_rgba(249,115,22,0.12)]'
                    : transparent
                    ? 'w-44 border-white/30 bg-white/15'
                    : 'w-44 border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Search
                  className={`h-3.5 w-3.5 flex-shrink-0 transition-colors ${
                    searchFocused ? 'text-orange-400' : transparent ? 'text-white/60' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`bg-transparent outline-none text-sm w-full ${
                    searchFocused
                      ? 'text-gray-900 placeholder:text-gray-400'
                      : transparent
                      ? 'text-white placeholder:text-white/55'
                      : 'text-gray-700 placeholder:text-gray-400'
                  }`}
                />
              </div>
            </form>

            {loading ? (
              <div className="w-36 h-9 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <Link href="/favorites">
                  <button
                    className={`p-2 rounded-xl transition-colors ${
                      transparent
                        ? 'text-white/80 hover:text-white hover:bg-white/15'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className="h-[18px] w-[18px]" />
                  </button>
                </Link>

                {isAdmin && (
                  <Link href="/admin">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        transparent
                          ? 'border-white/40 text-white hover:bg-white/15'
                          : 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100'
                      }`}
                    >
                      Admin
                    </span>
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative group">
                  <button
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-colors ${
                      transparent ? 'hover:bg-white/15' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-colors ${transparent ? 'text-white/60' : 'text-gray-400'}`}
                    />
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <div className="px-4 py-3.5 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{user?.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <Heart className="h-4 w-4" /> Favorites
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      transparent
                        ? 'text-white hover:bg-white/15'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Sign in
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-200/60 hover:shadow-orange-300/60 hover:from-orange-600 hover:to-rose-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              transparent ? 'text-white hover:bg-white/15' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Nav links */}
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex-1">{link.label}</span>
                    {isActive && <ArrowRight className="h-3.5 w-3.5" />}
                  </Link>
                );
              })}

              {/* Mobile search */}
              <div className="pt-2">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50"
                >
                  <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm flex-1 text-gray-700 placeholder:text-gray-400"
                  />
                </form>
              </div>

              {/* Mobile auth */}
              <div className="border-t border-gray-100 pt-3 space-y-0.5">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-sm">
                        {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="h-4 w-4" /> Favorites
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-1 pb-1">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 text-sm font-medium rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                        Sign in
                      </button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                      <button className="w-full py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-200/50">
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
