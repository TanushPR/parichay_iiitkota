import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parichay Team',
  description: 'Meet the student team building and managing Parichay.',
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
