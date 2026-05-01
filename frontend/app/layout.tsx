import Navbar from '@/components/shared/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased page-container">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
