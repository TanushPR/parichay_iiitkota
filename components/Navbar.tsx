'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/directory', label: 'Directory' },
  { href: '/clubs', label: 'Clubs' },
  { href: '/team', label: 'Team' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hash, setHash] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 16);
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    onScroll();
    setHash(window.location.hash);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', () => setHash(window.location.hash));
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const isActive = (href: string) => {
    const [path, anchor] = href.split('#');
    return pathname === path && (anchor ? hash === `#${anchor}` : !hash);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`${styles.navbar} ${pathname === '/' ? styles.homeNavbar : ''} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />

      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="Parichay home">
          <img src="/logo.png" alt="Parichay" className={styles.logoImg} />
          <span className={styles.logoText}>Parichay</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${active ? styles.active : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-nav" className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.mobileMenuInner}>
          <button type="button" className={styles.closeMenu} onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
          {NAV_LINKS.map((link, index) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileLink} ${active ? styles.mobileActive : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
