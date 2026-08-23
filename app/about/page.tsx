import type { Metadata } from 'next';
import Link from 'next/link';
import TeamSectionInteractive from '@/components/TeamSectionInteractive';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Parichay',
  description: 'Learn about the Parichay initiative — the student-run junior directory and campus hub that connects college communities.',
};

import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function AboutPage() {
  const siteContent: Record<string, string> = {};
  let teamMembers: any[] = [];

  try {
    const [contentRes, teamRes] = await Promise.allSettled([
      supabase.from('site_content').select('*'),
      supabase.from('team_members').select('*').order('display_order', { ascending: true })
    ]);

    if (contentRes.status === 'fulfilled' && contentRes.value.data) {
      contentRes.value.data.forEach((item: any) => {
        siteContent[item.key] = item.value;
      });
    }
    if (teamRes.status === 'fulfilled' && teamRes.value.data) {
      teamMembers = teamRes.value.data;
    }
  } catch (err) {
    console.error('Error loading about page data:', err);
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBlob} />
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={`badge badge-green ${styles.heroBadge}`}>ABOUT US</span>
              <h1 className={styles.heroTitle}>
                What is <span style={{ color: '#000' }}>Parichay</span>?
              </h1>
              <p className={styles.heroDesc}>
                {siteContent['about_description'] || (
                  <>
                    <em>Parichay</em> (परिचय) means <em>introduction</em> in Hindi. We are the student-run initiative that 
                    introduces every junior to the entire college — one beautifully designed profile at a time.
                  </>
                )}
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                <Link href="/directory" className="btn btn-primary btn-lg">
                  Browse Directory →
                </Link>
                <Link href="/clubs" className="btn btn-outline btn-lg">
                  Explore Clubs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className={`${styles.teamSection}`}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <p className="section-label" style={{ color: 'var(--accent-light)' }}>👥 The Team</p>
            <h2 className="section-title" style={{ color: '#ffffff' }}>Who Runs Parichay?</h2>
          </div>

          <TeamSectionInteractive members={teamMembers} />
        </div>
      </section>

      {/* Privacy & Consent */}
      <section className={styles.privacySection}>
        <div className="container">
          <div className={styles.privacyCard}>
            <span className={styles.privacyIcon}>🔒</span>
            <div className={styles.privacyContent}>
              <h2 className={styles.privacyTitle}>Data & Consent Policy</h2>
              <div className={styles.privacyPoints}>
                <div className={styles.privacyPoint}>
                  <span>✅</span>
                  <p><strong>Explicit consent required.</strong> Every profile is published only after the student checks the consent box confirming they agree to be featured on Instagram and this website.</p>
                </div>
                <div className={styles.privacyPoint}>
                  <span>🎯</span>
                  <p><strong>Minimal data collection.</strong> We only collect what the directory actually displays — name, branch, bio, photo, and socials. No phone numbers or addresses.</p>
                </div>
                <div className={styles.privacyPoint}>
                  <span>🗑️</span>
                  <p><strong>Right to be removed.</strong> Any student can request their profile to be taken down at any time by contacting us below.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <p className="section-label">📬 Reach Out</p>
            <h2 className="section-title">Contact the Team</h2>
          </div>
          <div className={styles.contactGrid}>
            <div id="remove" className={styles.contactCard}>
              <span className={styles.contactIcon}>🗑️</span>
              <h3 className={styles.contactTitle}>Remove My Profile</h3>
              <p className={styles.contactDesc}>
                Want your profile removed from the directory? Email us and we&apos;ll take it down within 48 hours.
              </p>
              <a href="mailto:parichayiiitkota@gmail.com" className="btn btn-outline">
                Email Us →
              </a>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>➕</span>
              <h3 className={styles.contactTitle}>Add Your Club</h3>
              <p className={styles.contactDesc}>
                Is your society missing from the clubs hub? Reach out and we&apos;ll get it listed.
              </p>
              <a href="mailto:parichayiiitkota@gmail.com" className="btn btn-outline">
                Contact Us →
              </a>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactIcon}>💡</span>
              <h3 className={styles.contactTitle}>Suggest a Feature</h3>
              <p className={styles.contactDesc}>
                Have an idea to make Parichay better? We&apos;re always improving — let us know.
              </p>
              <a href="mailto:parichayiiitkota@gmail.com" className="btn btn-outline">
                Share Idea →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
