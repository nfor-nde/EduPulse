'use client';

import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use CDN worker — most reliable approach across Next.js bundlers
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Proxy all PDFs through our server to avoid CORS issues
  const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
    setLoadError(false);
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error('PDF load error:', err);
    setLoadError(true);
    setIsLoading(false);
  }, []);

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));
  const zoomIn = () => setScale((s) => Math.min(3.0, s + 0.25));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.25));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#1a1a2e] font-sans">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#16213e] border-b border-white/10 flex-shrink-0">
        {/* Left: title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate leading-none">{title}</p>
            {numPages > 0 && (
              <p className="text-white/40 text-[11px] mt-0.5 font-mono">
                PDF Document · {numPages} {numPages === 1 ? 'page' : 'pages'}
              </p>
            )}
          </div>
        </div>

        {/* Center: page controls */}
        {numPages > 0 && !loadError && (
          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <button
              onClick={prevPage}
              disabled={pageNumber <= 1}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span className="text-white/80 text-xs font-bold font-mono w-20 text-center">
              {pageNumber} / {numPages}
            </span>
            <button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 flex items-center justify-center transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}

        {/* Right: zoom + download + close */}
        <div className="flex items-center gap-2">
          {!loadError && (
            <>
              <button onClick={zoomOut} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer" title="Zoom out">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </button>
              <span className="text-white/50 text-xs font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
              <button onClick={zoomIn} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer" title="Zoom in">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </button>
              <div className="w-px h-5 bg-white/20 mx-1" />
              <a
                href={proxiedUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                title="Download PDF"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span className="hidden sm:inline">Download</span>
              </a>
            </>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-600/80 text-white flex items-center justify-center transition cursor-pointer ml-1"
            title="Close viewer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── PDF Viewport ── */}
      <div className="flex-1 overflow-auto flex items-start justify-center py-6 px-4">
        {/* Loading spinner */}
        {isLoading && !loadError && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-white/60">
            <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading document...</p>
          </div>
        )}

        {/* Error state — fallback to iframe */}
        {loadError && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-900/30 border border-red-700/40 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Could not render PDF</p>
              <p className="text-white/50 text-sm mt-1">The document may be restricted. Try opening it directly.</p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition"
            >
              Open PDF in New Tab
            </a>
          </div>
        )}

        {/* PDF Document */}
        {!loadError && (
          <Document
            file={proxiedUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-2xl rounded-sm"
            />
          </Document>
        )}
      </div>

      {/* ── Bottom Page Jump Bar ── */}
      {numPages > 1 && !loadError && (
        <div className="flex items-center justify-center gap-3 py-3 bg-[#16213e] border-t border-white/10 flex-shrink-0">
          <button onClick={() => setPageNumber(1)} disabled={pageNumber === 1} className="text-xs text-white/50 hover:text-white disabled:opacity-30 font-mono transition cursor-pointer">First</button>
          <input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (v >= 1 && v <= numPages) setPageNumber(v);
            }}
            className="w-16 text-center bg-white/10 border border-white/20 text-white text-xs font-mono rounded-lg py-1.5 focus:outline-none focus:border-blue-500"
          />
          <button onClick={() => setPageNumber(numPages)} disabled={pageNumber === numPages} className="text-xs text-white/50 hover:text-white disabled:opacity-30 font-mono transition cursor-pointer">Last</button>
        </div>
      )}
    </div>
  );
}
