'use client';

import { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Search, X } from 'lucide-react';
import StudentCard, { SupabaseStudent } from '@/components/StudentCard';
import { CardSkeleton } from '@/components/Skeleton';
import { BRANCHES } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import { getCachedData, setCachedData } from '@/lib/clientCache';
import styles from './page.module.css';

export default function DirectoryPage() {
  const [students, setStudents] = useState<SupabaseStudent[]>(() => getCachedData<SupabaseStudent[]>('students') || []);
  const [loading, setLoading] = useState(() => !getCachedData<SupabaseStudent[]>('students'));
  const [query, setQuery] = useState('');
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get('q');
    if (initialQuery) setQuery(initialQuery);

    async function fetchData() {
      const cachedStudents = getCachedData<SupabaseStudent[]>('students');
      if (!cachedStudents) {
        const { data, error } = await supabase.from('students').select('*');
        if (error) {
          console.error('Error fetching students:', error);
        } else if (data) {
          setStudents(data);
          setCachedData('students', data);
        }
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedBranch = branch.trim().toLowerCase();
    const normalizedBatch = batch.trim();

    return students.filter((student) => {
      const matchesQuery =
        !normalizedQuery ||
        (student.name && student.name.toLowerCase().includes(normalizedQuery)) ||
        (student.hometown && student.hometown.toLowerCase().includes(normalizedQuery)) ||
        (student.branch && student.branch.toLowerCase().includes(normalizedQuery)) ||
        student.batch_year.toString().includes(normalizedQuery);

      const matchesBranch = !normalizedBranch || student.branch?.toLowerCase().trim() === normalizedBranch;
      const matchesBatch = !normalizedBatch || student.batch_year.toString() === normalizedBatch;

      return matchesQuery && matchesBranch && matchesBatch;
    });
  }, [students, query, branch, batch]);

  const batches = useMemo(
    () => Array.from(new Set(students.map((student) => student.batch_year))).sort((a, b) => b - a),
    [students]
  );

  const clearFilters = () => {
    setQuery('');
    setBranch('');
    setBatch('');
  };

  const hasFilters = Boolean(query || branch || batch);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div>
              <h1 className={styles.title}>Junior Directory</h1>
            </div>
          </div>

          <div className={styles.searchWrap}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                id="directory-search"
                type="text"
                className={`input ${styles.searchInput}`}
                placeholder="Search by name, branch, batch, or hometown"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  className={styles.clearSearch}
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  type="button"
                >
                  <X size={16} />
                </button>
              )}
              <button
                className={`${styles.filterButton} ${hasFilters ? styles.filterButtonActive : ''}`}
                onClick={() => setFiltersOpen((open) => !open)}
                aria-label="Open filters"
                aria-expanded={filtersOpen}
                type="button"
              >
                <MoreVertical size={18} />
                <span>Filters</span>
                {hasFilters && <i aria-hidden="true" />}
              </button>
            </div>
          </div>

          {filtersOpen && <div className={`${styles.filters} ${styles.filtersOpen}`}>
            <div className={styles.filterHeader}>
              <span>Filter options</span>
              {hasFilters && (
                <button className={styles.clearBtn} onClick={clearFilters} type="button">
                  Clear all
                </button>
              )}
            </div>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Branch</span>
              <div className={styles.filterPills}>
                <button
                  id="filter-branch-all"
                  className={`${styles.pill} ${!branch ? styles.pillActive : ''}`}
                  onClick={() => setBranch('')}
                  type="button"
                >
                  All
                </button>
                {BRANCHES.map((item) => (
                  <button
                    key={item}
                    id={`filter-branch-${item.toLowerCase()}`}
                    className={`${styles.pill} ${branch === item ? styles.pillActive : ''}`}
                    onClick={() => setBranch(branch === item ? '' : item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {batches.length > 0 && (
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Batch</span>
                <div className={styles.filterPills}>
                  <button
                    className={`${styles.pill} ${!batch ? styles.pillActive : ''}`}
                    onClick={() => setBatch('')}
                    type="button"
                  >
                    All
                  </button>
                  {batches.map((item) => (
                    <button
                      key={item}
                      className={`${styles.pill} ${batch === item.toString() ? styles.pillActive : ''}`}
                      onClick={() => setBatch(batch === item.toString() ? '' : item.toString())}
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {loading ? (
          <div className={styles.grid} aria-label="Loading profiles">
            {Array.from({ length: 6 }, (_, index) => <CardSkeleton key={index} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((student, index) => (
              <div
                key={student.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
              >
                <StudentCard student={student} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3 className={styles.emptyTitle}>No profiles found</h3>
            <p className={styles.emptyDesc}>Try a different search term or clear the branch filter.</p>
            <button className="btn btn-primary" onClick={clearFilters} type="button">
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
