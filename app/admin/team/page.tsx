'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatImageUrl } from '@/lib/utils';
import styles from '../page.module.css';

export interface TeamMember {
  id: string;
  name: string;
  role_description: string;
  photo_url: string;
  instagram_handle: string;
  display_order: number;
  bio?: string;
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching team members:', error);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }

  const handleAddNew = () => {
    const nextOrder = members.length > 0 ? Math.max(...members.map(m => m.display_order || 0)) + 1 : 1;
    setEditingMember({
      name: '', role_description: '', photo_url: '', instagram_handle: '', display_order: nextOrder, bio: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) {
      alert('Error deleting member');
    } else {
      fetchMembers();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsSubmitting(true);

    // Format image URL before saving
    let payload = { 
      ...editingMember,
      photo_url: formatImageUrl(editingMember.photo_url || '')
    };

    const attemptSave = async (currentPayload: any): Promise<void> => {
      try {
        if (currentPayload.id) {
          const { error } = await supabase.from('team_members').update(currentPayload).eq('id', currentPayload.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('team_members').insert([currentPayload]);
          if (error) throw error;
        }
      } catch (err: any) {
        // Check if error is about a missing column in schema cache
        const match = err.message?.match(/Could not find the '([^']+)' column/);
        if (match && match[1]) {
          const missingColumn = match[1];
          console.warn(`Column '${missingColumn}' not found in Supabase. Omitting and retrying...`);
          alert(`Warning: '${missingColumn}' column is missing in Supabase. Data for this field will not be saved until the column is added.`);
          delete currentPayload[missingColumn];
          return attemptSave(currentPayload); // Retry without the missing column
        }
        throw err; // If it's a different error, throw it
      }
    };

    try {
      await attemptSave(payload);
      setIsModalOpen(false);
      fetchMembers();
    } catch (err: any) {
      alert(err.message || 'Error saving member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Team & Credits Manager</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>+ Add Member</button>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Manage the team members displayed in the "Our Team" sections.
      </p>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>No team members found.</td></tr>
            ) : (
              members.map(member => (
                <tr key={member.id}>
                  <td style={{ fontWeight: 600 }}>{member.display_order}</td>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formatImageUrl(member.photo_url) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`}
                      alt={member.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}` }}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{member.name}</td>
                  <td>{member.role_description}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => handleEdit(member)}>Edit</button>
                    <button className={styles.actionBtn} style={{ color: '#ef4444' }} onClick={() => handleDelete(member.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingMember && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editingMember.id ? 'Edit Member' : 'Add New Member'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input required type="text" className="input" value={editingMember.name || ''} onChange={(e) => setEditingMember({...editingMember, name: e.target.value})} />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Display Order (1 is first)</label>
                  <input required type="number" className="input" value={editingMember.display_order || ''} onChange={(e) => setEditingMember({...editingMember, display_order: parseInt(e.target.value) || 0})} />
                </div>
                
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Instagram Handle or URL</label>
                  <input required type="text" className="input" value={editingMember.instagram_handle || ''} onChange={(e) => setEditingMember({...editingMember, instagram_handle: e.target.value})} />
                </div>
              </div>
              
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Photo URL</label>
                <input required type="url" className="input" value={editingMember.photo_url || ''} onChange={(e) => setEditingMember({...editingMember, photo_url: e.target.value})} />
              </div>
              

              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Bio</label>
                <textarea className="input" rows={4} value={editingMember.bio || ''} onChange={(e) => setEditingMember({...editingMember, bio: e.target.value})} placeholder="Enter the team member's bio..." />
              </div>

              <div className={styles.modalActions} style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
