import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased min-h-screen bg-gradient-to-r from-white to-gray-50">
        <div className="page-container">
          <Navbar />

          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
