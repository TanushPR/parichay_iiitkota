'use client';

import { useState, useMemo, useEffect } from 'react';
import StudentCard, { SupabaseStudent } from '@/components/StudentCard';
import { BRANCHES } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import { getCachedData, setCachedData } from '@/lib/clientCache';
import styles from './page.module.css';

export default function DirectoryPage() {
  const [students, setStudents] = useState<SupabaseStudent[]>(() => getCachedData<SupabaseStudent[]>('students') || []);
  const [subtitleTemplate, setSubtitleTemplate] = useState(() => getCachedData<string>('directory_subtitle') || 'Search {total} student profiles by name, branch, batch, or hometown.');
  const [loading, setLoading] = useState(() => !getCachedData<SupabaseStudent[]>('students'));
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('');

  useEffect(() => {
    async function fetchData() {
      const cachedStudents = getCachedData<SupabaseStudent[]>('students');
      const cachedSubtitle = getCachedData<string>('directory_subtitle');

      if (!cachedStudents) {
        const { data, error } = await supabase
          .from('students')
          .select('*');
        
        if (error) {
          console.error('Error fetching students:', error);
        } else if (data) {
          setStudents(data);
          setCachedData('students', data);
        }
      }

      if (!cachedSubtitle) {
        const { data: contentData } = await supabase
          .from('site_content')
          .select('value')
          .eq('key', 'directory_subtitle')
          .single();
        
        if (contentData && contentData.value) {
          setSubtitleTemplate(contentData.value);
          setCachedData('directory_subtitle', contentData.value);
        }
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchesQuery = !query || 
        (s.name && s.name.toLowerCase().includes(query.toLowerCase())) ||
        (s.hometown && s.hometown.toLowerCase().includes(query.toLowerCase()));
      const matchesBranch = !branch || (s.branch && s.branch.toLowerCase().trim() === branch.toLowerCase().trim());
      
      return matchesQuery && matchesBranch;
    });
  }, [students, query, branch]);

  const clearFilters = () => {
    setQuery('');
    setBranch('');
  };

  const hasFilters = query || branch;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div>
              <p className="section-label">🔍 Discover</p>
              <h1 className={styles.title}>Junior Directory</h1>
              <p className={styles.subtitle}>
                {subtitleTemplate.replace('{total}', students.length.toString())}
              </p>
            </div>
            <div className={styles.headerStats} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className={styles.statPill}>
                <span className={styles.statNum}>{loading ? '...' : filtered.length}</span>
                <span className={styles.statTxt}>
                  {filtered.length === 1 ? 'profile' : 'profiles'} found
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                id="directory-search"
                type="text"
                className={`input ${styles.searchInput}`}
                placeholder="Search by name or hometown..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  className={styles.clearSearch}
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Branch:</span>
              <div className={styles.filterPills}>
                <button
                  id="filter-branch-all"
                  className={`${styles.pill} ${!branch ? styles.pillActive : ''}`}
                  onClick={() => setBranch('')}
                >
                  All
                </button>
                {BRANCHES.map(b => (
                  <button
                    key={b}
                    id={`filter-branch-${b.toLowerCase()}`}
                    className={`${styles.pill} ${branch === b ? styles.pillActive : ''}`}
                    onClick={() => setBranch(branch === b ? '' : b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                className={`btn btn-ghost ${styles.clearBtn}`}
                onClick={clearFilters}
              >
                Clear All ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {loading ? (
          <div className={styles.empty}>
            <h3 className={styles.emptyTitle}>Loading profiles...</h3>
          </div>
        ) : filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((student, i) => (
              <div
                key={student.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
              >
                <StudentCard student={student} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🔍</span>
            <h3 className={styles.emptyTitle}>No profiles found</h3>
            <p className={styles.emptyDesc}>
              Try adjusting your search or clearing the filters.
            </p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
