'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatImageUrl } from '@/lib/utils';
import { SupabaseStudent } from '@/components/StudentCard';
import { BRANCHES } from '@/lib/mockData';
import styles from '../page.module.css';

export default function StudentManager() {
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<SupabaseStudent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<SupabaseStudent> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
    if (searchParams.get('action') === 'new') {
      handleAddNew();
    }
  }, [searchParams]);

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').order('name');
    if (error) {
      console.error('Error fetching students:', error);
    } else {
      setStudents(data || []);
    }
    setLoading(false);
  }

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchName = !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBranch = !filterBranch || s.branch === filterBranch;
      return matchName && matchBranch;
    });
  }, [students, searchQuery, filterBranch]);

  const handleAddNew = () => {
    setEditingStudent({
      name: '', branch: '', batch_year: '', hometown: '', bio: '', photo_url: '', instagram_handle: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (student: SupabaseStudent) => {
    setEditingStudent({ ...student });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) {
      alert('Error deleting student');
    } else {
      fetchStudents();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSubmitting(true);

    let payload = { 
      ...editingStudent,
      photo_url: formatImageUrl(editingStudent.photo_url)
    };

    const attemptSave = async (currentPayload: any): Promise<void> => {
      try {
        if (currentPayload.id) {
          const { error } = await supabase.from('students').update(currentPayload).eq('id', currentPayload.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('students').insert([currentPayload]);
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
      fetchStudents();
    } catch (err: any) {
      alert(err.message || 'Error saving student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Student Directory Manager</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>+ Add New</button>
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
        <select className="input" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
          <option value="">All Branches</option>
          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Thumb</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Batch</th>
              <th>Hometown</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>No students found.</td></tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formatImageUrl(student.photo_url) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`}
                      alt={student.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.name)}`
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{student.name}</td>
                  <td>{student.branch}</td>
                  <td>{student.batch_year}</td>
                  <td>{student.hometown}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => handleEdit(student)}>Edit</button>
                    <button className={styles.actionBtn} style={{ color: '#ef4444' }} onClick={() => handleDelete(student.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingStudent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editingStudent.id ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input required type="text" className="input" value={editingStudent.name || ''} onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Branch</label>
                  <select required className="input" value={editingStudent.branch || ''} onChange={(e) => setEditingStudent({...editingStudent, branch: e.target.value})}>
                    <option value="">Select Branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Batch Year</label>
                  <input required type="text" className="input" value={editingStudent.batch_year || ''} onChange={(e) => setEditingStudent({...editingStudent, batch_year: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Hometown</label>
                  <input required type="text" className="input" value={editingStudent.hometown || ''} onChange={(e) => setEditingStudent({...editingStudent, hometown: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Instagram Handle</label>
                  <input type="text" className="input" value={editingStudent.instagram_handle || ''} onChange={(e) => setEditingStudent({...editingStudent, instagram_handle: e.target.value})} />
                </div>
              </div>
              
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Photo URL</label>
                <input required type="url" className="input" value={editingStudent.photo_url || ''} onChange={(e) => setEditingStudent({...editingStudent, photo_url: e.target.value})} />
              </div>
              
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Bio</label>
                <textarea required className="input" rows={4} value={editingStudent.bio || ''} onChange={(e) => setEditingStudent({...editingStudent, bio: e.target.value})} />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
