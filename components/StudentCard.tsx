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

export default function StudentCard({ student, compact = false }: StudentCardProps) {
  // Smooth fallback avatar if missing
  const formattedUrl = formatImageUrl(student.photo_url);
  const photoUrl = formattedUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}&backgroundColor=b6e3f4`;

  return (
    <Link href={`/student/${student.id}`} className={`${styles.card} ${compact ? styles.compact : ''}`}>
      {/* Photo */}
      <div className={styles.photoWrap}>
        <img
          src={photoUrl}
          alt={student.name}
          className={styles.photo}
          width={200}
          height={200}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}&backgroundColor=e2e8f0`;
          }}
        />
        <div className={styles.photoOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.badges}>
          <span className={`badge badge-green ${styles.sagePill}`}>
            {student.branch}
          </span>
          <span className={`badge badge-green ${styles.sagePill}`}>
            &#39;{student.batch_year ? student.batch_year.toString().slice(-2) : ''}
          </span>
        </div>

        <h3 className={`${styles.name} ${styles.deepMatcha}`}>{student.name}</h3>

        <div className={styles.hometown}>
          <svg className={styles.pinIcon} xmlns="http://www.w3.org/200.5/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{student.hometown}</span>
        </div>

        {!compact && (
          <p className={styles.bio}>{student.bio}</p>
        )}

        {student.instagram_handle && (
          <div className={styles.instagram}>
            <span className={styles.igIcon}>@</span>
            <span>{student.instagram_handle}</span>
          </div>
        )}
      </div>

      {/* Hover arrow */}
      <div className={styles.arrow}>→</div>
    </Link>
  );
}
