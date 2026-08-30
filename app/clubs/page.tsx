'use client';

import { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCachedData, setCachedData } from '@/lib/clientCache';
import ClubCard, { SupabaseClub } from '@/components/ClubCard';
import { CardSkeleton } from '@/components/Skeleton';
import styles from './page.module.css';

export default function SocietiesPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [clubs, setClubs] = useState<SupabaseClub[]>(() => getCachedData<SupabaseClub[]>('clubs') || []);
  const [categories, setCategories] = useState<string[]>(() => getCachedData<string[]>('club_categories') || []);
  const [loading, setLoading] = useState(() => !getCachedData<SupabaseClub[]>('clubs'));

  useEffect(() => {
    async function fetchClubs() {
      const cached = getCachedData<SupabaseClub[]>('clubs');
      if (cached) {
        setClubs(cached);
        const uniqueCategories = Array.from(new Set(cached.map((club) => club.category))).filter(Boolean);
        setCategories(uniqueCategories);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from('clubs').select('*');
      if (data) {
        setClubs(data);
        setCachedData('clubs', data);
        const uniqueCategories = Array.from(new Set(data.map((club) => club.category))).filter(Boolean);
        setCategories(uniqueCategories);
        setCachedData('club_categories', uniqueCategories);
      } else if (error) {
        console.error('Error fetching clubs:', error);
      }

      setLoading(false);
    }

    fetchClubs();
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return clubs.filter((club) => {
      const matchesCategory = !activeCategory || club.category === activeCategory;
      const matchesSearch = !query || `${club.name} ${club.description} ${club.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [clubs, activeCategory, searchQuery]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Clubs and Societies</h1>

          <div className={styles.searchArea}>
            <div className={styles.searchBox}>
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search clubs or societies..."
                aria-label="Search clubs or societies"
              />
              <button
                type="button"
                className={styles.filterButton}
                onClick={() => setFiltersOpen((open) => !open)}
                aria-label="Open club filters"
                aria-expanded={filtersOpen}
              >
                <MoreVertical size={18} aria-hidden="true" />
                <span>Filter</span>
              </button>
            </div>

            {!loading && filtersOpen && categories.length > 0 && (
            <div className={styles.filters}>
              <button
                id="filter-cat-all"
                className={`${styles.catPill} ${!activeCategory ? styles.catActive : ''}`}
                onClick={() => setActiveCategory('')}
                type="button"
              >
                All categories
              </button>
              {categories.map((category) => {
                const count = clubs.filter((club) => club.category === category).length;
                return (
                  <button
                    key={category}
                    id={`filter-cat-${category.toLowerCase()}`}
                    className={`${styles.catPill} ${activeCategory === category ? styles.catActive : ''}`}
                    onClick={() => setActiveCategory(activeCategory === category ? '' : category)}
                    type="button"
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        {loading ? (
          <div className={styles.grid} aria-label="Loading clubs">
            {Array.from({ length: 6 }, (_, index) => <CardSkeleton key={index} />)}
          </div>
        ) : (
          <>
            <p className={styles.showingLabel}>
              Showing <strong>{filtered.length}</strong> {activeCategory || 'all'} clubs
            </p>

            <div className={styles.grid}>
              {filtered.map((club, index) => (
                <div
                  key={club.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <ClubCard club={club} />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className={styles.empty}>
                <p>No clubs found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h3 className={styles.ctaTitle}>Missing a club?</h3>
              <p className={styles.ctaDesc}>Reach out to the Parichay team and we will get it listed.</p>
            </div>
            <a href="/about#contact" className="btn btn-primary btn-lg">
              Contact us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
