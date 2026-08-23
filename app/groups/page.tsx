'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCachedData, setCachedData } from '@/lib/clientCache';
import GroupCard, { SupabaseGroup } from '@/components/GroupCard';
import styles from './page.module.css';

const CATEGORIES = ['Official', 'Batch Groups', 'Hostels & Mess', 'Gaming & Hobbies'];

export default function GroupsPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [groups, setGroups] = useState<SupabaseGroup[]>(() => getCachedData<SupabaseGroup[]>('groups') || []);
  const [loading, setLoading] = useState(() => !getCachedData<SupabaseGroup[]>('groups'));

  useEffect(() => {
    async function fetchGroups() {
      const cached = getCachedData<SupabaseGroup[]>('groups');
      if (cached) {
        setGroups(cached);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('groups').select('*');
      if (data) {
        setGroups(data);
        setCachedData('groups', data);
      } else if (error) {
        console.error('Error fetching groups:', error);
      }
      setLoading(false);
    }
    fetchGroups();
  }, []);

  const filtered = groups.filter(g => {
    // Only show active groups (treat undefined/null as active by default)
    if (g.is_active === false) return false;
    // Apply category filter if active
    if (activeCategory && g.category !== activeCategory) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className="container">
          <p className="section-label" style={{ color: 'var(--accent-light)' }}>💬 Communities</p>
          <h1 className={styles.title}>College Groups & Communities</h1>
          <p className={styles.subtitle}>
            Find official batch chats, hostel channels, and student interest hubs.
          </p>

          {/* Category filters */}
          <div className={styles.filters}>
            <button
              className={`${styles.catPill} ${!activeCategory ? styles.catActive : ''}`}
              onClick={() => setActiveCategory('')}
            >
              All Links
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.catPill} ${activeCategory === cat ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {loading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonLogo} />
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonDesc} />
                <div className={styles.skeletonDesc} style={{ width: '60%' }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className={styles.showingLabel}>
              Showing <strong>{filtered.length}</strong> {activeCategory || 'all'} {filtered.length === 1 ? 'group' : 'groups'}
            </p>

            <div className={styles.grid}>
              {filtered.map((group, i) => (
                <div
                  key={group.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <GroupCard group={group} />
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className={styles.empty}>
                <span>🔍</span>
                <p>No groups found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
