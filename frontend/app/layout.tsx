import Navbar from '@/components/shared/Navbar';
import FloatingBackdrop from '@/components/shared/FloatingBackdrop';
import PageTransition from '@/components/shared/PageTransition';
import RoleTheme from '@/components/shared/RoleTheme';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased page-container">
        <FloatingBackdrop />
        <RoleTheme />
        <Navbar />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
