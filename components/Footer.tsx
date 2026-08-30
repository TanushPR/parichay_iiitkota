import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ViewCounter from './ViewCounter';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { href: '/', label: 'Home' },
      { href: '/directory', label: 'Directory' },
      { href: '/clubs', label: 'Clubs & Societies' },
    ],
  },
  {
    title: 'Info',
    links: [
      { href: '/about', label: 'About Parichay' },
      { href: '/about#team', label: 'Meet the Team' },
      { href: '/about#contact', label: 'Contact Us' },
      { href: '/about#remove', label: 'Remove My Profile' },
    ],
  },
];

export default async function Footer() {
  const [{ count: studentCount }, { count: clubCount }] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('clubs').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.stats} aria-label="Parichay statistics">
          <div className={styles.stat}>
            <strong>{studentCount ?? 0}</strong>
            <span>Students registered</span>
          </div>
          <div className={styles.stat}>
            <strong>{clubCount ?? 0}</strong>
            <span>Clubs & societies</span>
          </div>
          <div className={`${styles.stat} ${styles.featuredStat}`}>
            <strong><ViewCounter /></strong>
            <span>Community visits</span>
          </div>
        </div>

        <div className={styles.top}>
          <div className={styles.brand}>
            <a
              href="https://www.instagram.com/parichay_iiitkota/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.logo}
            >
              <img src="/logo.png" alt="Parichay" className={styles.logoImg} />
              <span className={styles.logoText}>Parichay</span>
            </a>
            <p className={styles.tagline}>
              A cleaner, searchable way to discover juniors, student leaders, and campus communities.
            </p>
            <a
              href="https://www.instagram.com/parichay_iiitkota/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Follow on Instagram
            </a>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>{group.title}</h4>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} Parichay. Made for juniors, by juniors.
            </p>
            <p className={styles.disclaimer}>
              Student profiles are published only with consent.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
