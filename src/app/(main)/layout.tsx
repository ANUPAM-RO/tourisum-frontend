import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookTourProvider from '@/components/booking/BookTourProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookTourProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </BookTourProvider>
  );
}
