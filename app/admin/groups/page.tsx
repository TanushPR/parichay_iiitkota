'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../page.module.css';

interface Group {
  id: string;
  title: string;
  description: string;
  category: string;
  icon_type: string;
  link: string;
  is_active?: boolean;
}

const CATEGORIES = ['Official', 'Batch Groups', 'Hostels & Mess', 'Gaming & Hobbies'];
const PLATFORMS = ['WhatsApp', 'Discord', 'Telegram', 'Link'];

export default function GroupsManager() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Partial<Group> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    setLoading(true);
    const { data, error } = await supabase.from('groups').select('*').order('title');
    if (error) {
      console.error('Error fetching groups:', error);
      showToast('Error fetching groups', 'error');
    } else {
      setGroups(data || []);
    }
    setLoading(false);
  }

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchName = !searchQuery || g.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = !filterCategory || g.category === filterCategory;
      return matchName && matchCategory;
    });
  }, [groups, searchQuery, filterCategory]);

  const handleAddNew = () => {
    setEditingGroup({
      title: '', description: '', category: '', icon_type: 'link', link: '', is_active: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (group: Group) => {
    setEditingGroup({ ...group });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    const { error } = await supabase.from('groups').delete().eq('id', id);
    if (error) {
      showToast('Error deleting group', 'error');
    } else {
      showToast('Group deleted successfully', 'success');
      fetchGroups();
    }
  };

  const handleToggleActive = async (group: Group) => {
    const newStatus = !group.is_active;
    const { error } = await supabase.from('groups').update({ is_active: newStatus }).eq('id', group.id);
    if (error) {
      showToast('Error updating status. Does the active column exist?', 'error');
    } else {
      showToast(newStatus ? 'Group is now active' : 'Group is now hidden', 'success');
      fetchGroups();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;
    setIsSubmitting(true);

    let payload: any = { 
      title: editingGroup.title,
      description: editingGroup.description,
      category: editingGroup.category,
      icon_type: editingGroup.icon_type,
      link: editingGroup.link,
      is_active: editingGroup.is_active ?? true,
    };

    const attemptSave = async (currentPayload: any): Promise<void> => {
      try {
        if (editingGroup?.id) {
          const { error } = await supabase.from('groups').update(currentPayload).eq('id', editingGroup.id);
          if (error) throw error;
          showToast('Group updated successfully!');
        } else {
          const { error } = await supabase.from('groups').insert([currentPayload]);
          if (error) throw error;
          showToast('Group added successfully!');
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
      fetchGroups();
    } catch (err: any) {
      showToast(err.message || 'Error saving group', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Groups Manager</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>+ Add New Group</button>
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
              <th>Title</th>
              <th>Category</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredGroups.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>No groups found.</td></tr>
            ) : (
              filteredGroups.map(group => (
                <tr key={group.id}>
                  <td style={{ fontWeight: 600 }}>{group.title}</td>
                  <td>
                    <span className="badge badge-sage">
                      {group.category}
                    </span>
                  </td>
                  <td>{group.icon_type}</td>
                  <td>
                    <span 
                      className={`badge ${group.is_active === false ? 'badge-warm' : 'badge-green'}`}
                      style={{ cursor: 'pointer', opacity: 0.8 }}
                      onClick={() => handleToggleActive(group)}
                      title="Click to toggle"
                    >
                      {group.is_active === false ? 'Hidden' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => handleEdit(group)}>Edit</button>
                    <button className={styles.actionBtn} style={{ color: '#ef4444' }} onClick={() => handleDelete(group.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingGroup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editingGroup.id ? 'Edit Group' : 'Add New Group'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Group Title</label>
                  <input required type="text" className="input" value={editingGroup.title || ''} onChange={(e) => setEditingGroup({...editingGroup, title: e.target.value})} />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select required className="input" value={editingGroup.category || ''} onChange={(e) => setEditingGroup({...editingGroup, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Platform</label>
                  <select required className="input" value={editingGroup.icon_type || ''} onChange={(e) => setEditingGroup({...editingGroup, icon_type: e.target.value})}>
                    <option value="">Select Platform</option>
                    {PLATFORMS.map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Join Link URL</label>
                <input required type="url" className="input" value={editingGroup.link || ''} onChange={(e) => setEditingGroup({...editingGroup, link: e.target.value})} />
              </div>
              
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Description</label>
                <textarea required className="input" rows={3} value={editingGroup.description || ''} onChange={(e) => setEditingGroup({...editingGroup, description: e.target.value})} />
              </div>

              <div className={styles.formGroup} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="activeToggle"
                  checked={editingGroup.is_active !== false} 
                  onChange={(e) => setEditingGroup({...editingGroup, is_active: e.target.checked})} 
                />
                <label htmlFor="activeToggle" style={{ margin: 0, cursor: 'pointer' }}>Visible on public directory</label>
              </div>

              <div className={styles.modalActions} style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '1rem 1.5rem',
          background: toast.type === 'error' ? '#ef4444' : 'var(--accent)',
          color: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          animation: 'fadeInUp 0.3s ease'
        }}>
          {toast.type === 'error' ? '⚠️' : '✅'} {toast.message}
        </div>
      )}
    </div>
  );
}
