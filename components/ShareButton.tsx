'use client';

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  studentId: string;
  studentName: string;
  bio: string;
}

export default function ShareButton({ studentId, studentName, bio }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return undefined;

    const timer = window.setTimeout(() => setShowToast(false), 2500);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: studentName,
          text: bio,
          url: window.location.href,
        });
        return;
      } catch (error) {
        console.log('Error sharing', error);
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
    }
  };

  return (
    <>
      <button
        id={`share-btn-${studentId}`}
        className="btn btn-outline btn-lg profile-action"
        onClick={handleShare}
        type="button"
      >
        <Share2 size={16} aria-hidden="true" />
        <span>Share</span>
      </button>

      {showToast && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '1.5rem',
            transform: 'translateX(-50%)',
            padding: '0.8rem 1.1rem',
            borderRadius: '999px',
            background: '#18241d',
            color: '#fff',
            boxShadow: '0 18px 40px rgba(19, 33, 26, 0.22)',
            zIndex: 9999,
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            fontWeight: 600,
          }}
        >
          Profile link copied to clipboard.
        </div>
      )}
    </>
  );
}
