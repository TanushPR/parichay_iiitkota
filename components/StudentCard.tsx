'use client';

import Link from 'next/link';
import { formatImageUrl } from '@/lib/utils';
import styles from './StudentCard.module.css';

export interface SupabaseStudent {
  id: string;
  name: string;
  branch: string;
  batch_year: number;
  hometown: string;
  bio: string;
  photo_url: string;
  instagram_handle: string;
}

interface StudentCardProps {
  student: SupabaseStudent;
  compact?: boolean;
}

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function StudentCard({ student, compact = false }: StudentCardProps) {
  const formattedUrl = formatImageUrl(student.photo_url);
  const photoUrl =
    formattedUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}&backgroundColor=b6e3f4`;
  const igHandle = student.instagram_handle || '';
  const igLink = igHandle.startsWith('http') ? igHandle : `https://instagram.com/${igHandle}`;

  return (
    <Link href={`/student/${student.id}`} className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.photoWrap}>
        <img
          src={photoUrl}
          alt={student.name}
          className={styles.photo}
          width={400}
          height={520}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}&backgroundColor=e2e8f0`;
          }}
        />
        <div className={styles.photoOverlay} />

        <div className={styles.topRow}>
          <span className={styles.pill}>{student.branch} · {student.batch_year}</span>
          {igHandle && (
            <span
              className={styles.socialIcon}
              role="button"
              tabIndex={0}
              aria-label={`Open ${student.name}'s Instagram profile`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                window.open(igLink, '_blank', 'noopener,noreferrer');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  window.open(igLink, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <InstagramIcon />
            </span>
          )}
        </div>

        <div className={styles.overlayContent}>
          <h3 className={styles.name}>{student.name}</h3>
        </div>
      </div>
    </Link>
  );
}
