'use client';

import { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Search, X } from 'lucide-react';
import TeamSectionInteractive, { SupabaseTeamMember } from '@/components/TeamSectionInteractive';
import { CardSkeleton } from '@/components/Skeleton';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

type TeamMemberWithYear = SupabaseTeamMember & { year?: number; team_year?: number };

const getTeamYear = (member: TeamMemberWithYear) => member.year ?? member.team_year ?? 2026;

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMemberWithYear[]>([]);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) console.error('Error fetching team members:', error);
      setMembers((data || []) as TeamMemberWithYear[]);
      setLoading(false);
    }

    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesQuery =
        !normalizedQuery ||
        member.name.toLowerCase().includes(normalizedQuery) ||
        member.role_description?.toLowerCase().includes(normalizedQuery) ||
        member.bio?.toLowerCase().includes(normalizedQuery);
      const matchesYear = !year || getTeamYear(member).toString() === year;
      return matchesQuery && matchesYear;
    });
  }, [members, query, year]);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Team</h1>
          <div className={styles.searchArea}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search team members"
                aria-label="Search team members"
                className={styles.searchInput}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className={styles.clearButton} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                className={styles.filterButton}
                onClick={() => setFiltersOpen((open) => !open)}
                aria-label="Open team year filters"
                aria-expanded={filtersOpen}
              >
                <MoreVertical size={18} aria-hidden="true" />
                <span>Filter</span>
              </button>
            </div>

          {filtersOpen && <div className={styles.filterBar} aria-label="Filter team by year">
            <div className={styles.filters}>
              {['', '2025', '2026'].map((item) => (
                <button
                  key={item || 'all'}
                  type="button"
                  className={`${styles.filter} ${year === item ? styles.filterActive : ''}`}
                  onClick={() => setYear(item)}
                >
                  {item || 'All'}
                </button>
              ))}
            </div>
            <span className={styles.resultCount}>{loading ? 'Loading...' : `${filteredMembers.length} members`}</span>
          </div>}
          </div>
        </div>
      </section>

      <section className={styles.members}>
        <div className="container">
          {loading ? (
            <div className="skeleton-grid" aria-label="Loading team members">
              {Array.from({ length: 6 }, (_, index) => <CardSkeleton key={index} />)}
            </div>
          ) : filteredMembers.length > 0 ? (
            <TeamSectionInteractive members={filteredMembers} />
          ) : (
            <p className={styles.empty}>No team members found. Try another search or year.</p>
          )}
        </div>
      </section>
    </div>
  );
}
