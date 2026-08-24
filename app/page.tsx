import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TeamSectionInteractive from '@/components/TeamSectionInteractive';
import { formatImageUrl } from '@/lib/utils';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Home — Meet the Juniors',
  description: 'Discover our college\'s junior batch. Search profiles and explore clubs — all in one place.',
};

export const revalidate = 60;

export default async function HomePage() {
  let teamMembers: any[] = [];
  let siteContent: Record<string, string> = {};
  let clubs: any[] = [];

  try {
    const [teamRes, contentRes, clubsRes] = await Promise.allSettled([
      supabase.from('team_members').select('*').order('display_order', { ascending: true }),
      supabase.from('site_content').select('*'),
      supabase.from('clubs').select('*').limit(6)
    ]);

    if (teamRes.status === 'fulfilled' && teamRes.value.data) {
      teamMembers = teamRes.value.data;
    }
    if (contentRes.status === 'fulfilled' && contentRes.value.data) {
      contentRes.value.data.forEach((item: any) => {
        siteContent[item.key] = item.value;
      });
    }
    if (clubsRes.status === 'fulfilled' && clubsRes.value.data) {
      clubs = clubsRes.value.data;
    }
  } catch (err) {
    console.error('Error loading homepage data:', err);
  }

  const heroTitle = siteContent['home_hero_title'] || 'Meet the Class of 2026';
  const heroSubtitle = siteContent['home_hero_subtitle'] || 'Parichay is your one-stop hub to discover fellow students and explore clubs and societies — all beautifully organised in one place. 🌱';

  return (
    <>
      {/* ─── Hero ──────────────────────────────────── */}
      <section className={styles.hero}>
        
        {/* Decorative Background */}
        <div className={styles.heroBg}>
          {/* Constellation Network SVG */}
          <svg className={styles.constellationSvg} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="constellation" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#738A56" />
                <circle cx="120" cy="80" r="3" fill="#738A56" />
                <circle cx="80" cy="150" r="2" fill="#738A56" />
                <circle cx="180" cy="180" r="2.5" fill="#738A56" />
                <path d="M20,20 L120,80 L80,150 L180,180" stroke="#738A56" strokeWidth="0.5" fill="none" />
                <path d="M120,80 L180,180" stroke="#738A56" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#constellation)" />
          </svg>

          {/* Deep Matcha Organic Blobs */}
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          <div className={styles.blob3} />

          {/* Floating Pill Shapes */}
          <div className={styles.pillLeft} />
          <div className={styles.pillRight} />

          {/* Floating Glass Icons */}
          <div className={`${styles.glassIcon} ${styles.icon1}`} title="Graduation Cap">🎓</div>
          <div className={`${styles.glassIcon} ${styles.icon2}`} title="Monitor">🖥️</div>
          <div className={`${styles.glassIcon} ${styles.icon3}`} title="Laptop">💻</div>
          <div className={`${styles.glassIcon} ${styles.icon4}`} title="Network">🔆</div>
          <div className={`${styles.glassIcon} ${styles.icon5}`} title="Smiley">😀</div>
          <div className={`${styles.glassIcon} ${styles.icon6}`} title="Camera">📸</div>
        </div>

        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <h1 className={`${styles.heroTitle} animate-fadeInUp delay-100`}>
              <span className={styles.heroTitleShimmer}>{heroTitle}</span>
            </h1>

            <p className={`${styles.heroDesc} animate-fadeInUp delay-200`}>
              {heroSubtitle}
            </p>

            <div className={`${styles.heroBtns} animate-fadeInUp delay-400`}>
              <Link href="/directory" className="btn btn-primary btn-lg">
                Explore Directory →
              </Link>
              <Link href="/clubs" className="btn btn-outline btn-lg">
                Explore Clubs
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollText}>Scroll</span>
          <div className={styles.scrollLine}>
            <div className={styles.scrollDot} />
          </div>
        </div>
      </section>


      {/* ─── Our Team ─────────────────────────────── */}
      <section className={`section ${styles.teamSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <p className="section-label">👥 Our Team</p>
              <h2 className="section-title">Parichay Team 2026</h2>
              <p className="section-desc">
                A dedicated team of students managing design, development, data, and social media.
              </p>
            </div>
          </div>

          <TeamSectionInteractive members={teamMembers} />
        </div>
      </section>

      {/* ─── Clubs Preview ─────────────────────────── */}
      <section className={`section ${styles.clubsSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <p className="section-label">🏆 Clubs Hub</p>
              <h2 className="section-title">Find Your Tribe</h2>
              <p className="section-desc">
                From code to Carnatic music, robotics to dance — there&apos;s a society for every passion.
              </p>
            </div>
            <Link href="/clubs" className="btn btn-secondary">
              All Clubs →
            </Link>
          </div>

          <div className={styles.clubsGrid}>
            {clubs.map((club, i) => (
              <div
                key={club.id}
                className={`${styles.clubPreviewCard} animate-fadeInUp`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={styles.clubLogoWrap}>
                  {club.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={formatImageUrl(club.logo_url)} 
                      alt={club.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span className={styles.clubEmoji}>🏆</span>
                  )}
                </div>
                <div className={styles.clubPreviewInfo}>
                  <strong className={styles.clubPreviewName}>{club.name}</strong>
                  <span className={styles.clubPreviewMeta}>{club.category || 'General'}</span>
                </div>
                <span className={styles.clubArrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
