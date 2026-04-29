import Navbar from '@/components/shared/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-slate-900 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
