import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Junior Directory',
  description: 'Search and discover junior student profiles by name, branch, batch, or hometown.',
};

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
