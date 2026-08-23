export interface Student {
  id: string;
  name: string;
  displayName: string;
  branch: string;
  batchYear: string;
  hometown: string;
  bio: string;
  photoUrl: string;
  instagramHandle?: string;
  clubs: string[];
  funFact: string;
}

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  logoEmoji: string;
  instagramHandle?: string;
  joinLink?: string;
  memberCount: number;
  tags: string[];
}

export const BRANCHES = ['CSE', 'ECE', 'AIDE'];
export const BATCH_YEARS = ['2027', '2028'];
export const CLUB_CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Social', 'Literary', 'Music'];

const BRANCH_COLORS: Record<string, string> = {
  CSE: 'badge-blue',
  ECE: 'badge-purple',
  AIDE: 'badge-warm',
};

export function getBranchColor(branch: string): string {
  return BRANCH_COLORS[branch] ?? 'badge-green';
}
