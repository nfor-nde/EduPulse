'use client';

import React from 'react';

interface YoutubeViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

/**
 * Fullscreen YouTube embed viewer.
 * Ensures all player controls are visible and fullscreen button is enabled.
 */
export default function YoutubeViewer({ url, title, onClose }: YoutubeViewerProps) {
  // Normalise the URL: strip any existing query params and add our required ones
  const baseUrl = url.split('?')[0];
  const embedUrl = `${baseUrl}?controls=1&rel=0&fs=1&modestbranding=0&iv_load_policy=3&autoplay=1`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black font-sans">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-black/80 backdrop-blur border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate leading-none">{title}</p>
            <p className="text-white/40 text-[11px] mt-0.5">YouTube Video Lecture</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-600/80 text-white flex items-center justify-center transition cursor-pointer"
          title="Close viewer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* ── YouTube iframe (fills remaining space) ── */}
      <div className="flex-1 relative bg-black">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          loading="eager"
        />
      </div>
    </div>
  );
}
