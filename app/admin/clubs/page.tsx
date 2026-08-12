'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { formatImageUrl } from '@/lib/utils';
import styles from '../page.module.css';

interface Club {
  id: string;
  name: string;
  logo_url: string;
  category: string;
  description: string;
  instagram_handle: string;
  social_link?: string;
}

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Social', 'Literary', 'Music', 'Dance'];

export default function ClubsManager() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Partial<Club> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    setLoading(true);
    const { data, error } = await supabase.from('clubs').select('*').order('name');
    if (error) {
      console.error('Error fetching clubs:', error);
    } else {
      setClubs(data || []);
    }
    setLoading(false);
  }

  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      const matchName = !searchQuery || c.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = !filterCategory || c.category === filterCategory;
      return matchName && matchCategory;
    });
  }, [clubs, searchQuery, filterCategory]);

  const handleAddNew = () => {
    setEditingClub({
      name: '', logo_url: '', category: '', description: '', instagram_handle: '', social_link: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (club: Club) => {
    setEditingClub({ 
      ...club,
      logo_url: club.logo_url || '',
      instagram_handle: club.instagram_handle || club.social_link || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return;
    const { error } = await supabase.from('clubs').delete().eq('id', id);
    if (error) {
      alert('Error deleting club');
    } else {
      fetchClubs();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClub) return;
    setIsSubmitting(true);

    let payload: any = { 
      name: editingClub.name,
      category: editingClub.category,
      logo_url: formatImageUrl(editingClub.logo_url),
      instagram_handle: editingClub.instagram_handle,
      social_link: editingClub.instagram_handle, // Keep both synced
      description: editingClub.description
    };
    if (editingClub.id) {
      payload.id = editingClub.id;
    }

    const attemptSave = async (currentPayload: any): Promise<void> => {
      try {
        if (currentPayload.id) {
          const { error } = await supabase.from('clubs').update(currentPayload).eq('id', currentPayload.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('clubs').insert([currentPayload]);
          if (error) throw error;
        }
      } catch (err: any) {
        // Check if error is about a missing column in schema cache
        const match = err.message?.match(/Could not find the '([^']+)' column/);
        if (match && match[1]) {
          const missingColumn = match[1];
          console.warn(`Column '${missingColumn}' not found in Supabase. Omitting and retrying...`);
          delete currentPayload[missingColumn];
          return attemptSave(currentPayload); // Retry without the missing column
        }
        throw err; // If it's a different error, throw it
      }
    };

    try {
      await attemptSave(payload);
      setIsModalOpen(false);
      fetchClubs();
    } catch (err: any) {
      alert(err.message || 'Error saving club');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Clubs & Societies Manager</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>+ Add New Club</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="input"
          placeholder="Search name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Name</th>
              <th>Category</th>
              <th>Instagram Handle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredClubs.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>No clubs found.</td></tr>
            ) : (
              filteredClubs.map(club => (
                <tr key={club.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {club.logo_url ? (
                      <img
                        src={formatImageUrl(club.logo_url)}
                        alt={club.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(club.name)}`
                        }}
                      />
                    ) : (
                      <span className={styles.logo}>🏆</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{club.name}</td>
                  <td>
                    <span className="badge badge-sage">
                      {club.category}
                    </span>
                  </td>
                  <td>{club.instagram_handle ? `@${club.instagram_handle}` : 'N/A'}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => handleEdit(club)}>Edit</button>
                    <button className={styles.actionBtn} style={{ color: '#ef4444' }} onClick={() => handleDelete(club.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingClub && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editingClub.id ? 'Edit Club' : 'Add New Club'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Club Name</label>
                  <input required type="text" className="input" value={editingClub.name || ''} onChange={(e) => setEditingClub({...editingClub, name: e.target.value})} />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select required className="input" value={editingClub.category || ''} onChange={(e) => setEditingClub({...editingClub, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Instagram Handle or URL</label>
                  <input required type="text" className="input" value={editingClub.instagram_handle || ''} onChange={(e) => setEditingClub({...editingClub, instagram_handle: e.target.value})} />
                </div>
              </div>
              
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Logo URL</label>
                <input required type="url" className="input" value={editingClub.logo_url || ''} onChange={(e) => setEditingClub({...editingClub, logo_url: e.target.value})} />
              </div>
              
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Description</label>
                <textarea required className="input" rows={4} value={editingClub.description || ''} onChange={(e) => setEditingClub({...editingClub, description: e.target.value})} />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
