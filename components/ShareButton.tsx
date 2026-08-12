'use client';

import { useState } from 'react';

interface ShareButtonProps {
  studentId: string;
  studentName: string;
  bio: string;
}

export default function ShareButton({ studentId, studentName, bio }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: studentName,
        text: bio,
        url: window.location.href,
      }).catch((e) => console.log('Error sharing', e));
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      <button
        id={`share-btn-${studentId}`}
        className="btn btn-outline btn-lg"
        onClick={handleShare}
      >
        🔗 Share Profile
      </button>

      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '50px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          animation: 'fadeInUp 0.3s ease',
          fontFamily: 'var(--font-inter)',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          Profile link copied to clipboard!
        </div>
      )}
    </>
  );
}
