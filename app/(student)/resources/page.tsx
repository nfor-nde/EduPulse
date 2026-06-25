'use client';

import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import {
  SearchIcon,
  FilterIcon,
  VideoIcon,
  FileTextIcon,
} from '@/components/icons';
import { Resource } from '@/types';
import { useApp } from '@/context/AppContext';

// Lazy-load the heavy viewer components
const PdfViewer = lazy(() => import('@/components/PdfViewer'));
const YoutubeViewer = lazy(() => import('@/components/YoutubeViewer'));

/** Fire-and-forget interaction tracker */
async function trackInteraction(
  resourceId: string,
  action: 'view' | 'click' | 'download' | 'complete' | 'search',
  extra?: { duration?: number; metadata?: Record<string, string> }
) {
  try {
    await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, action, ...extra }),
    });
  } catch {
    // Silently ignore — tracking should never break the UI
  }
}

export default function StudentResourcesPage() {
  const { loggedInStudent } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  // Viewer state
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const viewStartRef = useRef<number | null>(null);

  // Derive unique filter options
  const faculties = Array.from(new Set(allResources.map((r) => r.faculty))).sort();
  const departments = Array.from(
    new Set(
      allResources
        .filter((r) => !selectedFaculty || r.faculty === selectedFaculty)
        .map((r) => r.dept)
    )
  ).sort();

  // Fetch resources on mount
  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/resources');
      if (!res.ok) throw new Error('Failed');
      const data: Resource[] = await res.json();
      setAllResources(data);
      setFilteredResources(data);
    } catch {
      console.error('Failed to fetch resources');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  // Client-side filtering
  useEffect(() => {
    let result = allResources;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.dept.toLowerCase().includes(q)
      );
    }
    if (selectedFaculty) result = result.filter((r) => r.faculty === selectedFaculty);
    if (selectedDept) result = result.filter((r) => r.dept === selectedDept);
    if (selectedLevel) result = result.filter((r) => String(r.level) === selectedLevel);
    if (selectedType) result = result.filter((r) => r.type === selectedType);
    setFilteredResources(result);
    setPage(1);
  }, [searchTerm, selectedFaculty, selectedDept, selectedLevel, selectedType, allResources]);

  // Track search interactions (debounced 800ms)
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (val.trim().length >= 3) {
      searchDebounce.current = setTimeout(() => {
        // Track search on first matching resource (or skip if none)
        if (filteredResources.length > 0) {
          trackInteraction(filteredResources[0].id, 'search', {
            metadata: { query: val.trim() },
          });
        }
      }, 800);
    }
  };

  // Open viewer and start tracking
  const openViewer = (resource: Resource) => {
    setViewingResource(resource);
    viewStartRef.current = Date.now();
    trackInteraction(resource.id, 'view');
  };

  // Close viewer and record view duration
  const closeViewer = () => {
    if (viewingResource && viewStartRef.current !== null) {
      const duration = Math.round((Date.now() - viewStartRef.current) / 1000);
      if (duration > 2) {
        // Only record if they spent more than 2 seconds
        trackInteraction(viewingResource.id, 'complete', { duration });
      }
      viewStartRef.current = null;
    }
    setViewingResource(null);
  };

  const isExternalPdf = (r: Resource) =>
    (r.type === 'notes' || r.type === 'pastpaper') && r.url.startsWith('https://');

  const getBadge = (type: string) => {
    if (type === 'youtube')
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-100"><VideoIcon className="w-3 h-3"/>Video</span>;
    if (type === 'pastpaper')
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100"><FileTextIcon className="w-3 h-3"/>Past Paper</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-100"><FileTextIcon className="w-3 h-3"/>Notes</span>;
  };

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / PER_PAGE);
  const paginatedResources = filteredResources.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearFilters = () => {
    setSearchTerm(''); setSelectedFaculty(''); setSelectedDept('');
    setSelectedLevel(''); setSelectedType('');
  };
  const hasFilters = searchTerm || selectedFaculty || selectedDept || selectedLevel || selectedType;

  return (
    <>
      {/* ── Fullscreen Viewers (rendered outside normal flow, over everything) ── */}
      {viewingResource && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        }>
          {viewingResource.type === 'youtube' ? (
            <YoutubeViewer
              url={viewingResource.url}
              title={viewingResource.title}
              onClose={closeViewer}
            />
          ) : isExternalPdf(viewingResource) ? (
            <PdfViewer
              url={viewingResource.url}
              title={viewingResource.title}
              onClose={closeViewer}
            />
          ) : (
            // Fallback for non-external resources
            <div className="fixed inset-0 z-50 bg-[#1a1a2e] flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 bg-[#16213e] border-b border-white/10">
                <span className="text-white font-bold text-sm truncate">{viewingResource.title}</span>
                <button onClick={closeViewer} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 space-y-4">
                  <h2 className="text-xl font-black text-slate-900">{viewingResource.title}</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-slate-700">{viewingResource.description}</div>
                  <p className="text-xs text-slate-500">{viewingResource.dept} · Level {viewingResource.level}</p>
                </div>
              </div>
            </div>
          )}
        </Suspense>
      )}

      {/* ── Main Page Content ── */}
      <div className="space-y-8 font-sans bg-white text-slate-900">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Resource Library
          </h1>
          <p className="text-sm font-bold text-slate-700 max-w-xl">
            {isLoading
              ? 'Loading resources...'
              : `${allResources.length.toLocaleString()} resources across all faculties and departments`}
            {loggedInStudent && (
              <span className="ml-2 text-blue-800">· Personalised for {loggedInStudent.dept}</span>
            )}
          </p>
        </div>

        {/* Search + Filter Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          {/* Search bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, department, or topic..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Faculty</label>
              <select
                value={selectedFaculty}
                onChange={(e) => { setSelectedFaculty(e.target.value); setSelectedDept(''); }}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-900 focus:outline-none focus:border-blue-800 cursor-pointer"
              >
                <option value="">All Faculties</option>
                {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-900 focus:outline-none focus:border-blue-800 cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-900 focus:outline-none focus:border-blue-800 cursor-pointer"
              >
                <option value="">All Levels</option>
                {[100,200,300,400,500].map((l) => <option key={l} value={String(l)}>Level {l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white text-slate-900 focus:outline-none focus:border-blue-800 cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="notes">Notes</option>
                <option value="pastpaper">Past Papers</option>
                <option value="youtube">Videos</option>
              </select>
            </div>
          </div>

          {/* Results summary + clear */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700">
              {isLoading ? '...' : `${filteredResources.length.toLocaleString()} results`}
              {hasFilters && <span className="text-slate-400"> (filtered)</span>}
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FilterIcon className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Resource Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 animate-pulse shadow-sm">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-5 bg-slate-100 rounded" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-9 bg-slate-100 rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : paginatedResources.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <SearchIcon className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-slate-900 font-extrabold text-lg">No resources found</p>
            <p className="text-xs font-bold text-slate-700">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="mt-2 text-xs font-bold text-blue-800 hover:underline cursor-pointer">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedResources.map((resource) => (
              <div
                key={resource.id}
                className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col space-y-3 shadow-sm hover:shadow-md hover:border-blue-300 transition duration-300"
              >
                <div className="flex items-center justify-between">
                  {getBadge(resource.type)}
                  <span className="text-[10px] font-bold text-slate-400">Lvl {resource.level}</span>
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-800 transition">
                    {resource.title}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 truncate">{resource.dept}</p>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{resource.description}</p>

                <button
                  onClick={() => {
                    trackInteraction(resource.id, 'click');
                    openViewer(resource);
                  }}
                  className="w-full mt-auto inline-flex items-center justify-center space-x-2 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition active:scale-[0.97] cursor-pointer"
                >
                  {resource.type === 'youtube' ? (
                    <><VideoIcon className="w-3.5 h-3.5" /><span>Watch Video</span></>
                  ) : (
                    <><FileTextIcon className="w-3.5 h-3.5" /><span>Open Document</span></>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
