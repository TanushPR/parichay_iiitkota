import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Parichay',
  description: 'Learn about the student-run junior directory and campus hub that connects college communities.',
};

export const revalidate = 60;

export default async function AboutPage() {
  const siteContent: Record<string, string> = {};

  try {
    const [contentRes] = await Promise.allSettled([
      supabase.from('site_content').select('*'),
    ]);

    if (contentRes.status === 'fulfilled' && contentRes.value.data) {
      contentRes.value.data.forEach((item: any) => {
        siteContent[item.key] = item.value;
      });
    }

  } catch (error) {
    console.error('Error loading about page data:', error);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            What is <span className={styles.accent}>Parichay</span>?
          </h1>
          <p className={styles.heroDesc}>
            {siteContent['about_description'] ||
              'Parichay means introduction. We help juniors introduce themselves to the campus through a clean, consent-based directory and clubs hub.'}
          </p>
          <div className={styles.heroActions}>
            <Link href="/directory" className="btn btn-primary btn-lg">
              Browse Directory
            </Link>
            <Link href="/clubs" className="btn btn-outline btn-lg">
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className="container">
          <div className={styles.valuesGrid}>
            <article className={styles.valueCard}>
              <p className={styles.valueLabel}>Consent first</p>
              <h3 className={styles.valueTitle}>Profiles go live only after approval.</h3>
              <p className={styles.valueText}>
                Every listing is published with explicit student consent and can be removed if requested.
              </p>
            </article>

            <article className={styles.valueCard}>
              <p className={styles.valueLabel}>Minimal data</p>
              <h3 className={styles.valueTitle}>Only what students choose to share.</h3>
              <p className={styles.valueText}>
                We keep the directory focused on the details people actually need to know.
              </p>
            </article>

            <article className={styles.valueCard}>
              <p className={styles.valueLabel}>Easy updates</p>
              <h3 className={styles.valueTitle}>Fast edits, quick removals, clearer listings.</h3>
              <p className={styles.valueText}>
                The team can update or remove entries with minimal friction when students reach out.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" className={styles.contactSection}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <p className="section-label">Reach out</p>
            <h2 className="section-title">Contact the team</h2>
          </div>

          <div className={styles.contactGrid}>
            <div id="remove" className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Remove my profile</h3>
              <p className={styles.contactDesc}>
                Want your profile removed from the directory? Email us and we will take it down within 48 hours.
              </p>
              <a href="mailto:parichayiiitkota@gmail.com" className="btn btn-outline">
                Email us
              </a>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Add your club</h3>
              <p className={styles.contactDesc}>
                Is your society missing from the clubs hub? Reach out and we will get it listed.
              </p>
              <a href="mailto:parichayiiitkota@gmail.com" className="btn btn-outline">
                Contact us
              </a>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.contactTitle}>Suggest a feature</h3>
              <p className={styles.contactDesc}>
                Have an idea to make Parichay better? We are always improving, so let us know.
              </p>
              <a href="mailto:parichayiiitkota@gmail.com" className="btn btn-outline">
                Share idea
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
