import type { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Campus Map',
  description: 'View the campus master plan for IIIT Kota.',
};

export default function CampusMapPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className="container">
          <p className="section-label" style={{ color: 'var(--accent-light)' }}>🗺️ Navigate</p>
          <h1 className={styles.title}>Campus Map</h1>
          <p className={styles.subtitle}>Explore the IIIT Kota campus master plan and find your way around.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.mapOuter}>
          <div className={styles.mapCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/clgmap.jpg"
              alt="Campus Master Plan"
              className={styles.mapImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
