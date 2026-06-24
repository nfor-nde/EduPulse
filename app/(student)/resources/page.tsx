'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Video, FileText, ExternalLink, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Resource } from '@/types';

export default function StudentResourcesPage() {
  const { resources } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);

  // Get unique lists for filters
  const faculties = Array.from(new Set(resources.map((r) => r.faculty)));
  const departments = Array.from(
    new Set(
      resources
        .filter((r) => !selectedFaculty || r.faculty === selectedFaculty)
        .map((r) => r.dept)
    )
  );

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => {
      const results = resources.filter((resource) => {
        const matchesSearch =
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFaculty = !selectedFaculty || resource.faculty === selectedFaculty;
        const matchesDept = !selectedDept || resource.dept === selectedDept;
        const matchesLevel = !selectedLevel || resource.level.toString() === selectedLevel;

        return matchesSearch && matchesFaculty && matchesDept && matchesLevel;
      });
      setFilteredResources(results);
      setIsSyncing(false);
    }, 500); // simulate network/filtering delay

    return () => clearTimeout(timer);
  }, [searchTerm, selectedFaculty, selectedDept, selectedLevel, resources]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFaculty('');
    setSelectedDept('');
    setSelectedLevel('');
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'pastpaper':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'notes':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'youtube':
        return <Video className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getResourceTypeBadge = (type: string) => {
    switch (type) {
      case 'pastpaper':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            Past Paper
          </span>
        );
      case 'notes':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            Course Notes
          </span>
        );
      case 'youtube':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
            YouTube Video
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-100">
            Reference
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
          Academic Resources Library
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Browse exam past papers, comprehensive course notes, and reference video playlists tailored specifically for the University of Buea curriculum.
        </p>
      </div>

      {/* Filter / Search panel */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search resources by title, course code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 bg-gray-50/50"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Faculty Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Faculty</label>
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                setSelectedDept(''); // reset dept when faculty changes
              }}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-800"
            >
              <option value="">All Faculties</option>
              {faculties.map((fac, i) => (
                <option key={i} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-800"
            >
              <option value="">All Departments</option>
              {departments.map((dept, i) => (
                <option key={i} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-800"
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
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resource Grid / Skeletons */}
      {isSyncing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                <div className="h-4 bg-gray-200 rounded-full w-12"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="pt-2 flex justify-between items-center border-t border-gray-50">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded-xl w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {getResourceTypeBadge(resource.type)}
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                    Level {resource.level}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-gray-900 leading-tight group-hover:text-blue-800 transition">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[10px] text-gray-400 font-medium">
                  <p className="font-semibold text-gray-700 truncate max-w-[130px]">
                    {resource.dept}
                  </p>
                  <p className="truncate max-w-[130px]">{resource.faculty}</p>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm group-hover:shadow hover:-translate-y-0.5"
                >
                  <span>{resource.type === 'youtube' ? 'Watch Video' : 'View File'}</span>
                  {getResourceTypeIcon(resource.type)}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 space-y-3 max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No resources found</h3>
          <p className="text-xs text-gray-500">
            We couldn't find any resources matching your exact filters or search query. Try broadening your keywords.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-blue-800 hover:underline pt-2"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
