'use client';

import React from 'react';
import { formatImageUrl } from '@/lib/utils';
import styles from './TeamCard.module.css';

export interface SupabaseTeamMember {
  id: string;
  name: string;
  role_description: string;
  photo_url: string;
  instagram_handle: string;
  display_order: number;
  bio?: string;
}

export default function TeamCard({ member }: { member: SupabaseTeamMember }) {
  const igHandle = member.instagram_handle || '';
  const igLink = igHandle.startsWith('http') ? igHandle : `https://instagram.com/${igHandle}`;
  const displayHandle = igHandle.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '').replace('@', '');

  const formattedUrl = formatImageUrl(member.photo_url);
  const photoUrl = formattedUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=b6e3f4`;

  return (
    <div className={styles.flipContainer}>
      <div className={styles.flipper}>
        
        {/* Front Face */}
        <div className={styles.frontFace}>
          <div className={styles.photoWrap}>
            <img
              src={photoUrl}
              alt={member.name}
              className={styles.photo}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=e2e8f0`;
              }}
            />
            <div className={styles.photoOverlay} />
          </div>

          <div className={styles.content}>
            <div className={styles.plainRole}>
              {member.role_description}
            </div>

            <h3 className={styles.name}>{member.name}</h3>

            {igHandle && (
              <div className={styles.instagram}>
                <span className={styles.igIcon}>@</span>
                <span>{displayHandle}</span>
              </div>
            )}
            
            <div className={styles.flipHint}>
              <span>🔄</span> Tap / Hover to flip
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className={styles.backFace}>
          <div className={styles.backHeader}>
            <h3 className={styles.name}>{member.name}</h3>
            <div className={styles.plainRole}>
              {member.role_description}
            </div>
          </div>

          <div className={styles.bio}>
            {member.bio || `Team member responsible for ${member.role_description}.`}
          </div>

          <div className={styles.backFooter}>
            {igHandle && (
              <a 
                href={igLink}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline w-full justify-center" 
                style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                @{displayHandle}
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
