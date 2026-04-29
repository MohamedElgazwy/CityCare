import Navbar from '@/components/shared/Navbar';

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}