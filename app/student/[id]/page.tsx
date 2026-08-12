import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ShareButton from '@/components/ShareButton';
import styles from './page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (!student) return { title: 'Student Not Found' };
  
  return {
    title: `${student.name} — ${student.branch}, Batch of ${student.batch_year}`,
    description: student.bio,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (!student) notFound();

  // Parse clubs if they are stored as JSON/text, or default to an empty array if missing
  // Assuming a `clubs` array column exists, if it's text we could JSON.parse, but let's assume it's array or string
  let clubsList: string[] = [];
  if (Array.isArray(student.clubs)) {
    clubsList = student.clubs;
  } else if (typeof student.clubs === 'string') {
    try {
      clubsList = JSON.parse(student.clubs);
    } catch {
      clubsList = student.clubs.split(',').map((c: string) => c.trim()).filter(Boolean);
    }
  }

  // Fallback photo
  const photoUrl = student.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}&backgroundColor=b6e3f4`;

  return (
    <div className={styles.page}>
      {/* Back */}
      <div className="container">
        <Link href="/directory" className={styles.backLink}>
          ← Back to Directory
        </Link>
      </div>

      {/* Profile Hero */}
      <div className={styles.profileHero}>
        <div className={styles.bgAccent} />
        <div className="container">
          <div className={styles.profileLayout}>
            {/* Photo Column */}
            <div className={styles.photoCol}>
              <div className={styles.photoWrap}>
                <img
                  src={photoUrl}
                  alt={student.name}
                  className={styles.photo}
                />
                <div className={styles.photoRing} />
              </div>
              {/* Quick Stats */}
              <div className={styles.quickStats}>
                <div className={styles.quickStat}>
                  <span className={styles.qsIcon}>🏛️</span>
                  <div>
                    <span className={styles.qsLabel}>Branch</span>
                    <span className={styles.qsValue}>{student.branch}</span>
                  </div>
                </div>
                <div className={styles.quickStat}>
                  <span className={styles.qsIcon}>📅</span>
                  <div>
                    <span className={styles.qsLabel}>Batch</span>
                    <span className={styles.qsValue}>Class of {student.batch_year}</span>
                  </div>
                </div>
                <div className={styles.quickStat}>
                  <span className={styles.qsIcon}>📍</span>
                  <div>
                    <span className={styles.qsLabel}>Hometown</span>
                    <span className={styles.qsValue}>{student.hometown}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className={styles.infoCol}>
              {/* Badges */}
              <div className={`flex gap-2 flex-wrap ${styles.profileBadges}`}>
                <span className={`badge badge-green`} style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)' }}>
                  {student.branch}
                </span>
                <span className={`badge badge-green`} style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)' }}>
                  Batch of {student.batch_year}
                </span>
                <span className="badge badge-green" style={{ backgroundColor: 'var(--accent-pale)', color: 'var(--accent-dark)' }}>
                  📍 {student.hometown}
                </span>
              </div>

              <h1 className={styles.name}>{student.name}</h1>

              {/* Bio */}
              <div className={styles.bioSection}>
                <h2 className={styles.bioTitle}>About Me</h2>
                <p className={styles.bio}>{student.bio}</p>
              </div>

              {/* Clubs */}
              {clubsList.length > 0 && (
                <div className={styles.clubsSection}>
                  <h3 className={styles.clubsTitle}>Clubs Interested In</h3>
                  <div className={`flex gap-2 flex-wrap`}>
                    {clubsList.map(club => (
                      <span key={club} className={styles.clubPill}>
                        {club}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className={styles.actions}>
                {student.instagram_handle && (
                  <a
                    id={`ig-link-${student.id}`}
                    href={`https://instagram.com/${student.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg"
                  >
                    📸 @{student.instagram_handle}
                  </a>
                )}
                <ShareButton
                  studentId={student.id}
                  studentName={student.name}
                  bio={student.bio}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
