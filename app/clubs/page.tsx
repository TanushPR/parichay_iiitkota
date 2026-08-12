'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ClubCard, { SupabaseClub } from '@/components/ClubCard';
import styles from './page.module.css';

export default function SocietiesPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [clubs, setClubs] = useState<SupabaseClub[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClubs() {
      const { data, error } = await supabase.from('clubs').select('*');
      if (data) {
        setClubs(data);
        // Extract unique categories
        const uniqueCats = Array.from(new Set(data.map(c => c.category))).filter(Boolean);
        setCategories(uniqueCats);
      }
      setLoading(false);
    }
    fetchClubs();
  }, []);

  const filtered = activeCategory
    ? clubs.filter(c => c.category === activeCategory)
    : clubs;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className="container">
          <p className="section-label" style={{ color: 'var(--accent-light)' }}>🏆 Get Involved</p>
          <h1 className={styles.title}>Clubs & Societies</h1>
          <p className={styles.subtitle}>
            {loading ? 'Loading active clubs...' : `${clubs.length} active clubs. Find your community. 🌱`}
          </p>

          {/* Category filters */}
          {!loading && categories.length > 0 && (
            <div className={styles.filters}>
              <button
                id="filter-cat-all"
                className={`${styles.catPill} ${!activeCategory ? styles.catActive : ''}`}
                onClick={() => setActiveCategory('')}
              >
                All Clubs ({clubs.length})
              </button>
              {categories.map(cat => {
                const count = clubs.filter(c => c.category === cat).length;
                return (
                  <button
                    key={cat}
                    id={`filter-cat-${cat.toLowerCase()}`}
                    className={`${styles.catPill} ${activeCategory === cat ? styles.catActive : ''}`}
                    onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {loading ? (
          <div className="flex justify-center py-10 text-muted">
            <span className="animate-spin text-2xl mr-3">☕</span> Pouring tea...
          </div>
        ) : (
          <>
            {/* Showing label */}
            <p className={styles.showingLabel}>
              Showing <strong>{filtered.length}</strong> {activeCategory || 'all'} {filtered.length === 1 ? 'club' : 'clubs'}
            </p>

            <div className={styles.grid}>
              {filtered.map((club, i) => (
                <div
                  key={club.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <ClubCard club={club} />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className={styles.empty}>
                <span>🔍</span>
                <p>No clubs found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h3 className={styles.ctaTitle}>Don&apos;t see your club? 🌟</h3>
              <p className={styles.ctaDesc}>
                Reach out to the Parichay team to get your society listed here.
              </p>
            </div>
            <a href="/about#contact" className="btn btn-primary btn-lg">
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
