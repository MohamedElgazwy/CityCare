import Navbar from '@/components/shared/Navbar';
import FloatingBackdrop from '@/components/shared/FloatingBackdrop';
import PageTransition from '@/components/shared/PageTransition';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased page-container">
        <FloatingBackdrop />
        <Navbar />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
