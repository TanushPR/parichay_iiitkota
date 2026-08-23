'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatImageUrl } from '@/lib/utils';

export interface SupabaseTeamMember {
  id: string;
  name: string;
  role_description: string;
  photo_url: string;
  instagram_handle: string;
  display_order: number;
  bio?: string;
}

const InstagramIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const UserIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default function TeamSectionInteractive({ members }: { members: SupabaseTeamMember[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Split into chunks of 4
  const rows = [];
  for (let i = 0; i < members.length; i += 4) {
    rows.push(members.slice(i, i + 4));
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
        alignItems: 'center'
      }}
      onMouseLeave={() => setHoveredId(null)}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="team-row-mobile"
          style={{
            display: 'flex',
            gap: 16,
            width: '100%',
            maxWidth: 1080,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          {row.map((m) => {
            const isHovered = hoveredId === m.id;
            const igHandle = m.instagram_handle || '';
            const igLink = igHandle.startsWith('http') ? igHandle : `https://instagram.com/${igHandle}`;
            const photoUrl = formatImageUrl(m.photo_url) || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}&backgroundColor=e2e8f0`;
            const bio = m.bio || `Team member responsible for ${m.role_description}.`;

            return (
              <div
                key={m.id}
                className="team-card-mobile"
                onMouseEnter={() => setHoveredId(m.id)}
                style={{
                  flex: isHovered ? "0 0 300px" : "1 1 0%",
                  minWidth: 0,
                  maxWidth: isHovered ? "300px" : "calc((100% - 48px) / 4)",
                  borderRadius: 24,
                  overflow: "hidden",
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: isHovered
                    ? "var(--shadow-hover)"
                    : "var(--shadow-md)",
                  transition:
                    "flex-basis 0.45s cubic-bezier(0.22,1,0.36,1), flex-grow 0.45s cubic-bezier(0.22,1,0.36,1), max-width 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease",
                }}
              >
                {/* Photo */}
                <div
                  className="team-photo-mobile"
                  style={{
                    position: "relative",
                    height: isHovered ? 220 : 380,
                    width: "100%",
                    transition: "height 0.45s cubic-bezier(0.22,1,0.36,1)",
                    display: "flex",
                    alignItems: "flex-end",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={photoUrl}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    unoptimized={photoUrl.startsWith('http')}
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(43,58,44,0.85) 100%)",
                    }}
                  />
                  <div className="team-overlay-mobile" style={{ position: "relative", padding: 16, display: "flex", flexDirection: "column", gap: 6, width: "100%", zIndex: 2 }}>
                    <div className="team-name-mobile" style={{ color: "#fff", fontFamily: 'var(--font-display)', fontSize: isHovered ? 20 : 18, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {m.name}
                    </div>
                    <div className="team-role-mobile" style={{ color: "var(--accent-light)", fontSize: 13, fontWeight: 500, whiteSpace: isHovered ? "normal" : "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {m.role_description}
                    </div>
                    {!isHovered && igHandle && (
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <a
                          href={igLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="team-social-mobile"
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.9)",
                            color: "var(--accent)",
                            flexShrink: 0,
                          }}
                        >
                          <InstagramIcon />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded panel */}
                <div
                  style={{
                    maxHeight: isHovered ? 340 : 0,
                    opacity: isHovered ? 1 : 0,
                    transition: "max-height 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease " + (isHovered ? "0.1s" : "0s"),
                    overflow: "hidden",
                    background: 'var(--bg-card)'
                  }}
                >
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {bio}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <UserIcon style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: "uppercase", letterSpacing: 0.4 }}>
                            Role
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{m.role_description}</div>
                        </div>
                      </div>
                    </div>
                    {igHandle && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <a
                          href={igLink}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "var(--accent-pale)",
                            color: "var(--accent)",
                            flexShrink: 0,
                          }}
                        >
                          <InstagramIcon />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
