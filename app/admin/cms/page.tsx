'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../page.module.css';

export default function GlobalCMS() {
  const [content, setContent] = useState({
    home_hero_title: 'Meet the Class of 2026',
    home_hero_subtitle: 'Explore the newest batch of talented juniors joining the IIIT Kota family.',
    about_description: 'We built this site to bridge the gap between seniors and juniors.',
    directory_subtitle: 'Search {total} student profiles by name, branch, batch, or hometown.',
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('site_content').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          const newContent: any = {};
          data.forEach(item => {
            newContent[item.key] = item.value;
          });
          setContent(prev => ({ ...prev, ...newContent }));
        }
      } catch (err: any) {
        console.error('Failed to fetch CMS content:', err.message);
      }
      setLoading(false);
    }
    fetchContent();
  }, []);

  const handleChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Upsert each key
      const updates = Object.entries(content).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from('site_content').upsert(updates, { onConflict: 'key' });
      
      if (error) throw error;
      alert('Settings saved successfully to Supabase database!');
    } catch (err: any) {
      alert(`Error saving content: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className={styles.sectionTitle}>Site Text & Global CMS</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Manage the text displayed across the public website.
      </p>

      {loading ? (
        <p>Loading content...</p>
      ) : (
        <form onSubmit={handleSave} style={{ maxWidth: '800px', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Home Page</h3>
          <div className={styles.formGroup}>
            <label>Hero Title</label>
            <input type="text" className="input" value={content.home_hero_title} onChange={(e) => handleChange('home_hero_title', e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Hero Subtitle</label>
            <textarea className="input" rows={2} value={content.home_hero_subtitle} onChange={(e) => handleChange('home_hero_subtitle', e.target.value)} />
          </div>

          <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />

          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>About Page</h3>
          <div className={styles.formGroup}>
            <label>Description Paragraph</label>
            <textarea className="input" rows={4} value={content.about_description} onChange={(e) => handleChange('about_description', e.target.value)} />
          </div>

          <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />

          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Directory Page</h3>
          <div className={styles.formGroup}>
            <label>Directory Subtitle (use {'{total}'} for dynamic count)</label>
            <input type="text" className="input" value={content.directory_subtitle} onChange={(e) => handleChange('directory_subtitle', e.target.value)} />
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
