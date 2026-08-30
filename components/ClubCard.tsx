'use client';

import { FaInstagram } from 'react-icons/fa';
import { formatImageUrl } from '@/lib/utils';
import styles from './ClubCard.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  Technical: '#4f84cc',
  Cultural: '#8c69d6',
  Sports: '#d98924',
  Social: '#4b9a78',
  Literary: '#c0a11d',
  Music: '#d85e93',
};

export interface SupabaseClub {
  id: string;
  name: string;
  description: string;
  category: string;
  logo_url: string;
  instagram_handle?: string;
  social_link?: string;
  join_link?: string;
}

interface ClubCardProps {
  club: SupabaseClub;
}

export default function ClubCard({ club }: ClubCardProps) {
  const tone = CATEGORY_COLORS[club.category] || '#5f7d57';
  const socialHref =
    (club.instagram_handle || club.social_link || '').startsWith('http')
      ? (club.instagram_handle || club.social_link || '')
      : `https://instagram.com/${club.instagram_handle || club.social_link || ''}`;

  return (
    <article className={styles.card} style={{ '--card-tone': tone } as React.CSSProperties}>
      <div className={styles.accentBar} style={{ background: tone }} />

      <div className={styles.logoWrap}>
        {club.logo_url ? (
          <img
            src={formatImageUrl(club.logo_url)}
            alt={club.name}
            className={styles.logoImg}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) {
                fallback.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <span className={styles.logoFallback} style={{ display: club.logo_url ? 'none' : 'flex', color: tone }}>
          P
        </span>
      </div>

      <div className={styles.clubInfo}>
        <span className={styles.categoryBadge} style={{ background: `${tone}16`, color: tone }}>
          {club.category || 'General'}
        </span>

        <div className={styles.nameRow}>
          <h3 className={styles.name}>{club.name}</h3>
          {(club.instagram_handle || club.social_link) && (
            <a
              href={socialHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialBtn}
              style={{ color: tone }}
              aria-label={`Open ${club.name} Instagram page`}
            >
              <FaInstagram size={14} />
            </a>
          )}
        </div>

        <p className={styles.description}>{club.description}</p>

        <div className={styles.footer}>
        {club.join_link && (
          <a href={club.join_link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Join
          </a>
        )}
        </div>
      </div>
    </article>
  );
}
