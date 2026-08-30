'use client';

import Image from 'next/image';
import { formatImageUrl } from '@/lib/utils';
import styles from './TeamSectionInteractive.module.css';

export interface SupabaseTeamMember {
  id: string;
  name: string;
  role_description: string;
  photo_url: string;
  instagram_handle: string;
  display_order: number;
  bio?: string;
}

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function TeamSectionInteractive({ members }: { members: SupabaseTeamMember[] }) {
  return (
    <div className="grid-4">
      {members.map((member, index) => {
        const igHandle = member.instagram_handle || '';
        const igLink = igHandle.startsWith('http') ? igHandle : `https://instagram.com/${igHandle}`;
        const photoUrl =
          formatImageUrl(member.photo_url) ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=e2e8f0`;
        const bio = member.bio || (member.role_description ? `Responsible for ${member.role_description}.` : 'Parichay team member.');
        return (
          <article
            key={member.id}
            className={`${styles.memberCard} surface-soft card animate-fadeInUp`}
            style={{
              overflow: 'hidden',
              animationDelay: `${Math.min(index * 0.06, 0.3)}s`,
            }}
          >
            <div className={styles.photoBlock} style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}>
              <Image
                src={photoUrl}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized={photoUrl.startsWith('http')}
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.photoOverlay}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(19,33,26,0.04) 30%, rgba(19,33,26,0.82) 100%)',
                }}
              />
              <div className={styles.photoOverlayContent}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1rem',
                  color: '#fff',
                }}
              >
                <div className={styles.nameRow}>
                  <p className={styles.name}>{member.name}</p>
                  {igHandle && (
                    <a
                      href={igLink}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.instagramIcon}
                      aria-label={`Open ${member.name}'s Instagram profile`}
                    >
                      <InstagramIcon />
                    </a>
                  )}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {member.role_description}
                </p>
              </div>
            </div>

            <div className={styles.cardDetails}>
              <p className={styles.bio}>{bio}</p>
            </div>

            <div className={styles.mobileInfo}>
              <div className={styles.mobileNameRow}>
                <p className={styles.mobileName}>{member.name}</p>
                {igHandle && <a href={igLink} target="_blank" rel="noreferrer" className={styles.mobileInstagram} aria-label={`Open ${member.name}'s Instagram profile`}><InstagramIcon /></a>}
              </div>
              <p className={styles.mobileRole}>{member.role_description}</p>
              <p className={styles.mobileBio}>{bio}</p>
            </div>

          </article>
        );
      })}
    </div>
  );
}
