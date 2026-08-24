import Link from 'next/link';
import styles from './Footer.module.css';

const FOOTER_LINKS = {
  Explore: [
    { href: '/', label: 'Home' },
    { href: '/directory', label: 'Directory' },
    { href: '/clubs', label: 'Clubs & Societies' },
  ],
  Info: [
    { href: '/about', label: 'About Parichay' },
    { href: '/about#team', label: 'Meet the Team' },
    { href: '/about#contact', label: 'Contact Us' },
    { href: '/about#remove', label: 'Remove My Profile' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <a 
            href="https://www.instagram.com/parichay_iiitkota/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.logo}
          >
            <img src="/logo.png" alt="Parichay IIIT Kota" className={styles.logoImg} />
            <span className={styles.logoText}>Parichay</span>
          </a>
          <p className={styles.tagline}>
            From Google Form to Instagram Grid — and now, a searchable college hub.
            Built with 💚 by the student community.
          </p>
          <div className={`flex gap-3 ${styles.socials}`}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
              Instagram ↗
            </a>
          </div>
        </div>

        {/* Links */}
        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section} className={styles.linkGroup}>
            <h4 className={styles.linkGroupTitle}>{section}</h4>
            <ul className={styles.linkList}>
              {links.map(link => (
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

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Parichay. Made for juniors, by juniors. 🍵
            </p>
            <p className={styles.disclaimer}>
              All profiles published with explicit student consent.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
