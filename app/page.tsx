import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TeamCard from '@/components/TeamCard';
import { formatImageUrl } from '@/lib/utils';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Home — Meet the Juniors',
  description: 'Discover our college\'s junior batch. Search profiles, explore clubs, and navigate campus — all in one place.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {

  // Fetch team members
  const { data: teamMembersData } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });
  const teamMembers = teamMembersData || [];

  // Fetch site content
  const { data: siteContentData } = await supabase.from('site_content').select('*');

  // Fetch clubs
  const { data: clubsData } = await supabase.from('clubs').select('*').limit(6);
  const clubs = clubsData || [];
  const siteContent: Record<string, string> = {};
  if (siteContentData) {
    siteContentData.forEach(item => {
      siteContent[item.key] = item.value;
    });
  }

  const heroTitle = siteContent['home_hero_title'] || 'Meet the Class of 2026';
  const heroSubtitle = siteContent['home_hero_subtitle'] || 'Parichay is your one-stop hub to discover fellow students, explore clubs and societies, and navigate campus — all beautifully organised in one place. 🌱';

  return (
    <>
      {/* ─── Hero ──────────────────────────────────── */}
      <section className={styles.hero}>
        
        {/* New Decorative Background Overhaul */}
        <div className={styles.heroBg}>
          {/* Constellation Network SVG (Background) */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.25 }} xmlns="http://www.w3.org/200.5/svg">
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

          {/* Geometric Grid Corners */}
          <svg className="absolute top-0 right-0 w-64 h-64 opacity-20" xmlns="http://www.w3.org/200.5/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#738A56" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-64 h-64 opacity-20" xmlns="http://www.w3.org/200.5/svg">
            <rect width="100%" height="100%" fill="url(#grid)" />
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
          <div className={`${styles.glassIcon} ${styles.icon2}`} title="Graduation Monitor">🖥️</div>
          <div className={`${styles.glassIcon} ${styles.icon3}`} title="Laptop">💻</div>
          <div className={`${styles.glassIcon} ${styles.icon4}`} title="Network Hub">🔆</div>
          <div className={`${styles.glassIcon} ${styles.icon5}`} title="Smiley Face">😀</div>
          <div className={`${styles.glassIcon} ${styles.icon6}`} title="Camera">📸</div>
        </div>

        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <h1 className={`${styles.heroTitle} animate-fadeInUp delay-100`}>
              {heroTitle}<br />
            </h1>

            <p className={`${styles.heroDesc} animate-fadeInUp delay-200`}>
              {heroSubtitle}
            </p>


            <div className={`flex gap-4 flex-wrap animate-fadeInUp delay-400`} style={{ marginTop: '1rem' }}>
              <Link href="/directory" className="btn btn-primary btn-lg">
                Explore Directory →
              </Link>
              <Link href="/clubs" className="btn btn-outline btn-lg">
                Explore Clubs
              </Link>
            </div>
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

          <div className={styles.teamGrid}>
            {teamMembers.map((member, i) => (
              <div
                key={member.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <TeamCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Clubs Preview ─────────────────────────── */}
      <section className="section">
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
                <div style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--accent-pale, rgba(0,0,0,0.05))' }}>
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
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}

