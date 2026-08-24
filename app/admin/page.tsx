'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    designed: 0,
    posted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase.from('students').select('*');
        if (error) throw error;

        const total = data.length;
        const pending = data.filter((s) => s.status === 'pending' || !s.status).length;
        const designed = data.filter((s) => s.status === 'designed').length;
        const posted = data.filter((s) => s.status === 'posted').length;

        setStats({ total, pending, designed, posted });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className={styles.sectionTitle}>Dashboard Overview</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{loading ? '...' : stats.total}</div>
          <div className={styles.statLabel}>Total Juniors</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{loading ? '...' : stats.pending}</div>
          <div className={styles.statLabel}>Pending Verification</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{loading ? '...' : stats.designed}</div>
          <div className={styles.statLabel}>Designed Grids</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{loading ? '...' : stats.posted}</div>
          <div className={styles.statLabel}>Posted Grids</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.quickActions}>
        <Link href="/admin/students?action=new" className="btn btn-primary">
          + Add New Student
        </Link>
        <Link href="/admin/cms" className="btn btn-outline">
          Edit Site Banner
        </Link>
      </div>
    </div>
  );
}
