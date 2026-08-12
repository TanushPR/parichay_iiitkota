'use client';

import styles from './GroupCard.module.css';

const PLATFORM_COLORS: Record<string, string> = {
  whatsapp: '#25D366',
  discord: '#5865F2',
  telegram: '#0088cc',
  link: 'var(--accent)',
};

const PLATFORM_ICONS: Record<string, string> = {
  whatsapp: '💬',
  discord: '👾',
  telegram: '✈️',
  link: '🔗',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Official': 'badge-sage',
  'Batch Groups': 'badge-blue',
  'Hostels & Mess': 'badge-warm',
  'Gaming & Hobbies': 'badge-purple',
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
  const icon = PLATFORM_ICONS[group.icon_type?.toLowerCase()] || PLATFORM_ICONS['link'];
  const color = PLATFORM_COLORS[group.icon_type?.toLowerCase()] || PLATFORM_COLORS['link'];

  return (
    <div className={styles.card}>
      <div className={styles.logoWrap} style={{ color }}>
        <span className={styles.logo}>{icon}</span>
      </div>

      <div className={styles.header}>
        <h3 className={styles.name}>{group.title}</h3>
        <span className={`badge ${CATEGORY_COLORS[group.category] || 'badge-green'}`}>
          {group.category}
        </span>
      </div>

      <p className={styles.description}>{group.description}</p>

      <div className={styles.footer}>
        <div className={styles.actions}>
          {group.link && (
            <a 
              href={group.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: '100%', textAlign: 'center' }}
            >
              Join Group ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
