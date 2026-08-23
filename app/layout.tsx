import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://parichay.app'),
  title: {
    default: 'Parichay — Meet the Juniors',
    template: '%s | Parichay',
  },
  description: 'Parichay is the official junior directory, clubs hub, and campus navigation site for our college. Discover students, societies, and spaces.',
  keywords: ['college directory', 'junior introduction', 'student profiles', 'campus guide', 'clubs societies'],
  icons: {
    icon: '/logo.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Parichay — Meet the Juniors',
    description: 'A searchable junior directory, clubs hub, and campus navigation site.',
    type: 'website',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" style={{ scrollBehavior: 'smooth' }}>
      <body>
        <Navbar />
        <main className="page-wrapper" style={{ paddingTop: '72px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
