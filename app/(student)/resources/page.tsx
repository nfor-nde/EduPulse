'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  SearchIcon,
  FilterIcon,
  VideoIcon,
  FileTextIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon
} from '@/components/icons';
import { Resource } from '@/types';

export default function StudentResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);

  // Resource Viewer state
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [pdfZoom, setPdfZoom] = useState(100);

  // Derive unique filter options from all resources
  const faculties = Array.from(new Set(allResources.map((r) => r.faculty)));
  const departments = Array.from(
    new Set(
      allResources
        .filter((r) => !selectedFaculty || r.faculty === selectedFaculty)
        .map((r) => r.dept)
    )
  );

  // Fetch all resources once on mount
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/resources');
        if (!res.ok) throw new Error('Failed to fetch resources');
        const data: Resource[] = await res.json();
        setAllResources(data);
        setFilteredResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Client-side filtering
  const applyFilters = useCallback(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const results = allResources.filter((resource) => {
        const matchesSearch =
          !searchTerm ||
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFaculty = !selectedFaculty || resource.faculty === selectedFaculty;
        const matchesDept = !selectedDept || resource.dept === selectedDept;
        const matchesLevel = !selectedLevel || resource.level.toString() === selectedLevel;
        return matchesSearch && matchesFaculty && matchesDept && matchesLevel;
      });
      setFilteredResources(results);
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedFaculty, selectedDept, selectedLevel, allResources]);

  useEffect(() => {
    const cleanup = applyFilters();
    return cleanup;
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFaculty('');
    setSelectedDept('');
    setSelectedLevel('');
  };

  const getResourceTypeBadge = (type: string) => {
    switch (type) {
      case 'pastpaper':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Past Paper
          </span>
        );
      case 'notes':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
            Course Notes
          </span>
        );
      case 'youtube':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-900 border border-red-200">
            YouTube Video
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-800 border border-slate-200">
            Reference
          </span>
        );
    }
  };

  const getMockPdfContent = (resource: Resource) => {
    return (
      <div
        className="space-y-6 text-slate-900 leading-relaxed max-w-2xl mx-auto p-4 transition-all duration-300 select-text"
        style={{ fontSize: `${(pdfZoom / 100) * 14}px` }}
      >
        <div className="border-b border-slate-300 pb-4 text-center">
          <span className="text-[10px] font-bold text-blue-800 tracking-wider uppercase">{resource.faculty}</span>
          <h2 className="text-xl font-black text-slate-900 mt-1">{resource.title}</h2>
          <p className="text-xs text-slate-700 mt-1">Level {resource.level} &bull; {resource.dept}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-950">1. Executive Overview</h3>
          <p>
            This document outlines the core learning modules, standard schemas, and operational instructions relevant to the course syllabus. Students are requested to audit all sections carefully.
          </p>
          <div className="bg-blue-50/50 p-4 border border-blue-200 rounded-xl my-2 text-xs">
            <span className="font-extrabold text-blue-900 block mb-1">Key Revision Guideline:</span>
            {resource.description}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-950">2. Technical Framework Details</h3>
          <p>
            When preparing for final examinations, particular focus should be given to conceptual paradigms, algorithmic workflows, and standard industry application examples.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 list-inside text-slate-850">
            <li>Review all chapter summaries and laboratory assignments.</li>
            <li>Consult previous term past papers to understand question schemas.</li>
            <li>Collaborate with classmates on case studies and project portfolios.</li>
          </ul>
        </div>

        <div className="border-t border-slate-350 pt-8 mt-12 text-center text-[10px] text-slate-500 font-mono">
          End of Document &bull; Compiled by EduPulse Resource Registry
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans bg-white text-slate-900">
      {/* Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Academic Resources Library
        </h1>
        <p className="text-xs font-bold text-slate-700 max-w-2xl">
          Search, filter, and view course notes, official past papers, and instructional videos directly in your browser.
        </p>
      </div>

      {/* Filter / Search panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-3.5 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search resources by title, course code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Faculty Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Faculty</label>
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                setSelectedDept('');
              }}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800"
            >
              <option value="">All Faculties</option>
              {faculties.map((fac, i) => (
                <option key={i} value={fac}>{fac}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800"
            >
              <option value="">All Departments</option>
              {departments.map((dept, i) => (
                <option key={i} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800"
            >
              <option value="">All Levels</option>
              <option value="100">Level 100</option>
              <option value="200">Level 200</option>
              <option value="300">Level 300</option>
              <option value="400">Level 400</option>
            </select>
          </div>

          {/* Clear Filters CTA */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FilterIcon className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resource Grid / Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-200 rounded-full w-20"></div>
                <div className="h-4 bg-slate-200 rounded-full w-12"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
              </div>
              <div className="pt-2 flex justify-between items-center border-t border-slate-200">
                <div className="h-3 bg-slate-200 rounded w-24"></div>
                <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-300 hover:scale-[1.01] transition duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {getResourceTypeBadge(resource.type)}
                  <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    Level {resource.level}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-800 transition">
                  {resource.title}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                  {resource.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-[10px] text-slate-700 font-bold">
                  <p className="truncate max-w-[130px]">{resource.dept}</p>
                  <p className="text-slate-500 font-medium truncate max-w-[130px]">{resource.faculty}</p>
                </div>
                <button
                  onClick={() => {
                    setViewingResource(resource);
                    setPdfZoom(100);
                  }}
                  className="inline-flex items-center space-x-1.5 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <span>{resource.type === 'youtube' ? 'Watch Video' : 'View File'}</span>
                  {resource.type === 'youtube' ? <VideoIcon className="w-3.5 h-3.5" /> : <FileTextIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 space-y-3 max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto border border-slate-200">
            <FilterIcon className="w-5 h-5 text-slate-500" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No resources found</h3>
          <p className="text-xs text-slate-700">
            We couldn&apos;t find any resources matching your search queries. Try adjusting your filter parameters.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-blue-800 hover:underline pt-2 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Embedded Document / Video Viewer Modal */}
      {viewingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col h-[85vh] relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {viewingResource.type === 'youtube' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-900 border border-red-200">
                    Video Player
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
                    Document Reader
                  </span>
                )}
                <span className="text-xs font-bold text-slate-900 truncate max-w-[280px] md:max-w-md">
                  {viewingResource.title}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {viewingResource.type !== 'youtube' && (
                  <div className="flex items-center space-x-2 border-r border-slate-200 pr-3">
                    <button
                      onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))}
                      className="p-1 hover:bg-slate-100 rounded transition text-slate-700 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOutIcon className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-800 w-10 text-center">
                      {pdfZoom}%
                    </span>
                    <button
                      onClick={() => setPdfZoom(Math.min(200, pdfZoom + 10))}
                      className="p-1 hover:bg-slate-100 rounded transition text-slate-700 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomInIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setViewingResource(null)}
                  className="p-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 bg-white overflow-y-auto p-6">
              {viewingResource.type === 'youtube' ? (
                <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-950">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={viewingResource.url}
                    title={viewingResource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-inner min-h-[60vh]">
                  {getMockPdfContent(viewingResource)}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 font-bold">
              <span>{viewingResource.dept} &bull; Level {viewingResource.level}</span>
              <button
                onClick={() => setViewingResource(null)}
                className="px-5 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
