import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import ShareButton from '@/components/ShareButton';
import styles from './page.module.css';

export const revalidate = 120;

interface Props {
  params: Promise<{ id: string }>;
}

const getStudent = cache(async (id: string) => {
  const { data: student } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();
  return student;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) return { title: 'Student Not Found' };
  
  return {
    title: `${student.name} — ${student.branch}, Batch of ${student.batch_year}`,
    description: student.bio,
  };
}

const GraduationCap = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

function InfoRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon}><Icon /></div>
      <div>
        <div className={styles.infoLabel}>{label}</div>
        <div className={styles.infoValue}>{value}</div>
      </div>
    </div>
  );
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  
  const student = await getStudent(id);

  if (!student) notFound();

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

  const photoUrl = student.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}&backgroundColor=b6e3f4`;

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/directory" className={styles.backLink}>
          ← Back to Directory
        </Link>
      </div>

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
            </div>

            {/* Info Column */}
            <div className={styles.infoCol}>
              <h1 className={styles.name}>{student.name}</h1>
              
              <div className={styles.infoRows}>
                <InfoRow icon={GraduationCap} label="Branch" value={student.branch} />
                <InfoRow icon={Calendar} label="Batch" value={`Class of ${student.batch_year}`} />
                <InfoRow icon={MapPin} label="Hometown" value={student.hometown} />
              </div>

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
