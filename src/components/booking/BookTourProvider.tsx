'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import BookTourDialog from './BookTourDialog';

interface BookTourContextValue {
  /** Open the enquiry form, optionally pre-filled with a destination. */
  openBooking: (destination?: string) => void;
}

const BookTourContext = createContext<BookTourContextValue | null>(null);

export function useBookTour() {
  const ctx = useContext(BookTourContext);
  if (!ctx) throw new Error('useBookTour must be used within a BookTourProvider');
  return ctx;
}

export default function BookTourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState('');

  const openBooking = useCallback((dest?: string) => {
    setDestination(dest ?? '');
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openBooking }), [openBooking]);

  // Detail pages have their own mobile bottom bars; keep the floating button clear of them on small screens.
  const isDetailPage = /^\/(places|hotels|restaurants)\/[^/]+$/.test(pathname ?? '');

  return (
    <BookTourContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => openBooking()}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`fixed right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-xl shadow-orange-500/30 transition-[filter,transform] hover:brightness-110 active:scale-95 sm:right-6 ${
              isDetailPage ? 'bottom-24 lg:bottom-6' : 'bottom-5 sm:bottom-6'
            }`}
            aria-label="Book a tour"
          >
            <CalendarCheck className="h-5 w-5" />
            <span>Book a tour</span>
          </motion.button>
        )}
      </AnimatePresence>

      <BookTourDialog open={open} onOpenChange={setOpen} defaultDestination={destination} />
    </BookTourContext.Provider>
  );
}
