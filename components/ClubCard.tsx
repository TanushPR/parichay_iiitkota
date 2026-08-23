'use client';

import { FaInstagram } from 'react-icons/fa';
import { formatImageUrl } from '@/lib/utils';
import styles from './ClubCard.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  Technical:  '#3B82F6',
  Cultural:   '#7C5CD6',
  Sports:     '#F59E0B',
  Social:     '#10B981',
  Literary:   '#EAB308',
  Music:      '#EC4899',
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
  const tone = CATEGORY_COLORS[club.category] || '#7C5CD6';
  
  return (
    <div className={styles.card} style={{ '--card-tone': tone } as React.CSSProperties}>
      {/* Top accent */}
      <div className={styles.accentBar} style={{ background: tone }} />

      <div className={styles.logoWrap}>
        {club.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={formatImageUrl(club.logo_url)} 
            alt={club.name} 
            className={styles.logoImg}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextElementSibling) {
                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
              }
            }}
          />
        ) : null}
        <span className={styles.logoFallback} style={{ display: club.logo_url ? 'none' : 'flex', color: tone }}>🏆</span>
      </div>

      <span className={styles.categoryBadge} style={{ background: `${tone}15`, color: tone }}>
        {club.category}
      </span>

      <h3 className={styles.name}>{club.name}</h3>
      <p className={styles.description}>{club.description}</p>
      
      <div className={styles.footer}>
        {(club.instagram_handle || club.social_link) && (
          <a
            href={(club.instagram_handle || club.social_link || '').startsWith('http') ? (club.instagram_handle || club.social_link) : `https://instagram.com/${club.instagram_handle || club.social_link}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialBtn}
          >
            <FaInstagram size={14} />
          </a>
        )}
        {club.join_link && (
          <a 
            href={club.join_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.joinBtn}
          >
            Join
          </a>
        )}
      </div>
    </div>
  );
}
