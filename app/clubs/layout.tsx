import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clubs & Societies',
  description: 'Explore student clubs and societies across cultural, technical, literary, social, and sports communities.',
};

export default function ClubsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
