'use client';

import { FaWhatsapp } from 'react-icons/fa';
import styles from './GroupCard.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  'Official': '#10B981',
  'Batch Groups': '#3B82F6',
  'Hostels & Mess': '#F59E0B',
  'Gaming & Hobbies': '#7C5CD6',
};

const PLATFORM_ICONS: Record<string, string> = {
  whatsapp: '💬',
  discord: '👾',
  telegram: '✈️',
  link: '🔗',
};

export interface SupabaseGroup {
  id: string;
  title: string;
  description: string;
  category: string;
  icon_type: string;
  link: string;
  is_active?: boolean;
}

interface GroupCardProps {
  group: SupabaseGroup;
}

export default function GroupCard({ group }: GroupCardProps) {
  const tone = CATEGORY_COLORS[group.category] || '#7C5CD6';
  const emojiIcon = PLATFORM_ICONS[group.icon_type?.toLowerCase()] || PLATFORM_ICONS['link'];

  return (
    <div className={styles.card} style={{ '--card-tone': tone } as React.CSSProperties}>
      <div className={styles.accentBar} style={{ background: tone }} />

      <div className={styles.iconWrap} style={{ borderColor: `${tone}55` }}>
        <span className={styles.iconEmoji}>{emojiIcon}</span>
      </div>

      <span className={styles.categoryBadge} style={{ background: `${tone}15`, color: tone }}>
        {group.category}
      </span>

      <h3 className={styles.name}>{group.title}</h3>
      <p className={styles.description}>{group.description}</p>
      
      <div className={styles.footer}>
        {group.link && (
          <a
            href={group.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkBtn}
          >
            <FaWhatsapp size={14} />
            <span>Open</span>
          </a>
        )}
      </div>
    </div>
  );
}
