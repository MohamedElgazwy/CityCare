import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen bg-gradient-to-r from-white-70 to-gray-50">
        <Navbar />
        {children}<Footer />
      </body>
    </html>
  );
}
