'use client';

import { formatImageUrl } from '@/lib/utils';
import styles from './ClubCard.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  Technical:  'badge-blue',
  Cultural:   'badge-purple',
  Sports:     'badge-warm',
  Social:     'badge-sage',
  Literary:   'badge-yellow',
  Music:      'badge-pink',
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
  return (
    <div className={styles.card}>
      <div className={styles.logoWrap} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {club.logo_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={formatImageUrl(club.logo_url)} 
              alt={club.name} 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => {
                // Fallback to initial avatar if link is broken or restricted
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <span className={styles.logo} style={{ display: 'none' }}>🏆</span>
          </>
        ) : (
          <span className={styles.logo}>🏆</span>
        )}
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.name}>{club.name}</h3>
        <span className={`badge ${CATEGORY_COLORS[club.category] ?? 'badge-green'}`}>
          {club.category}
        </span>
      </div>

      {/* Description */}
      <p className={styles.description}>{club.description}</p>

      {/* Actions */}
      <div className={styles.footer}>
        <div className={styles.actions}>
          {club.join_link && (
            <a 
              href={club.join_link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Join Club
            </a>
          )}
          {(club.instagram_handle || club.social_link) && (
            <a 
              href={(club.instagram_handle || club.social_link || '').startsWith('http') ? (club.instagram_handle || club.social_link) : `https://instagram.com/${club.instagram_handle || club.social_link}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Instagram ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
