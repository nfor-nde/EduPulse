'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CreditCardIcon, SupportIcon, CheckIcon, SearchIcon } from '@/components/icons';

export default function AdminFinancePage() {
  const { students, markTuitionPaid, approveMedicalClearance } = useApp();
  const [activeTab, setActiveTab] = useState<'tuition' | 'medical'>('tuition');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Independent Pagination States
  const [tuitionPage, setTuitionPage] = useState(1);
  const [medicalPage, setMedicalPage] = useState(1);
  const pageSize = 10;

  const overdueTuitionList = students.filter(
    (s) =>
      s.tuitionStatus === 'Overdue' &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.matricule.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingMedicalList = students.filter(
    (s) =>
      s.medicalStatus === 'Pending' &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.matricule.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Tuition Pagination Math
  const totalTuition = overdueTuitionList.length;
  const totalTuitionPages = Math.max(1, Math.ceil(totalTuition / pageSize));
  const activeTuitionPage = Math.min(tuitionPage, totalTuitionPages);
  const startTuitionIndex = (activeTuitionPage - 1) * pageSize;
  const paginatedTuitionList = overdueTuitionList.slice(startTuitionIndex, startTuitionIndex + pageSize);

  // Medical Pagination Math
  const totalMedical = pendingMedicalList.length;
  const totalMedicalPages = Math.max(1, Math.ceil(totalMedical / pageSize));
  const activeMedicalPage = Math.min(medicalPage, totalMedicalPages);
  const startMedicalIndex = (activeMedicalPage - 1) * pageSize;
  const paginatedMedicalList = pendingMedicalList.slice(startMedicalIndex, startMedicalIndex + pageSize);

  const handleMarkPaid = async (id: string) => {
    await markTuitionPaid(id);
  };

  const handleApproveMedical = async (id: string) => {
    await approveMedicalClearance(id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setTuitionPage(1);
    setMedicalPage(1);
  };

  return (
    <div className="space-y-8 font-sans bg-white text-slate-905">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Finance & Clearance</h1>
        <p className="text-xs font-bold text-slate-700 max-w-2xl">
          Manage outstanding student tuition fees and approve clinical medical clearance documents.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-205">
        <button
          onClick={() => {
            setActiveTab('tuition');
            setSearchQuery('');
            setTuitionPage(1);
          }}
          className={`flex items-center space-x-2.5 pb-4 px-6 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'tuition'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <CreditCardIcon className="w-4 h-4" />
          <span>Tuition Management</span>
          <span className="bg-red-50 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-red-200 ml-1">
            {students.filter((s) => s.tuitionStatus === 'Overdue').length} Overdue
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('medical');
            setSearchQuery('');
            setMedicalPage(1);
          }}
          className={`flex items-center space-x-2.5 pb-4 px-6 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'medical'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          <SupportIcon className="w-4 h-4" />
          <span>Medical Clearance</span>
          <span className="bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-amber-200 ml-1">
            {students.filter((s) => s.medicalStatus === 'Pending').length} Pending
          </span>
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3.5 top-3 text-slate-550 w-4 h-4" />
        <input
          type="text"
          placeholder="Filter students by name or ID..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl text-xs focus:outline-none focus:border-blue-800"
        />
      </div>

      {/* Tab Panels */}
      {activeTab === 'tuition' && (
        <div className="bg-white border border-slate-250 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Outstanding Tuition Ledger</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="p-4 pl-6">Student</th>
                  <th className="p-4">Faculty / Department</th>
                  <th className="p-4">Outstanding Tuition</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-900">
                {paginatedTuitionList.length > 0 ? (
                  paginatedTuitionList.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/40 transition">
                      <td className="p-4 pl-6">
                        <div className="font-extrabold text-slate-900">{student.name}</div>
                        <div className="text-[10px] font-mono text-slate-700 font-bold mt-0.5">
                          {student.matricule}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{student.dept}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{student.faculty}</div>
                      </td>
                      <td className="p-4 font-extrabold text-red-700">
                        25,000 CFA Francs <span className="text-[10px] text-slate-700 font-medium">(Term 2 Balance)</span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleMarkPaid(student.id)}
                          className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition text-[10px] inline-flex items-center space-x-1 hover:scale-102 active:scale-98 shadow-sm cursor-pointer"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>Mark as Paid</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-550 font-medium">
                      No outstanding tuition payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Tuition Pagination Controls */}
          {totalTuitionPages > 1 && (
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-705">
                Showing {startTuitionIndex + 1} to {Math.min(startTuitionIndex + pageSize, totalTuition)} of {totalTuition} accounts
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTuitionPage((p) => Math.max(1, p - 1))}
                  disabled={activeTuitionPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition"
                >
                  Previous
                </button>
                <span className="font-bold text-slate-900">
                  Page {activeTuitionPage} of {totalTuitionPages}
                </span>
                <button
                  onClick={() => setTuitionPage((p) => Math.min(totalTuitionPages, p + 1))}
                  disabled={activeTuitionPage === totalTuitionPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'medical' && (
        <div className="bg-white border border-slate-250 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Pending Physical Examination Clearances</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="p-4 pl-6">Student</th>
                  <th className="p-4">Department / Level</th>
                  <th className="p-4">Filing Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-900">
                {paginatedMedicalList.length > 0 ? (
                  paginatedMedicalList.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/40 transition">
                      <td className="p-4 pl-6">
                        <div className="font-extrabold text-slate-900">{student.name}</div>
                        <div className="text-[10px] font-mono text-slate-700 font-bold mt-0.5">
                          {student.matricule}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{student.dept}</div>
                        <div className="text-[10px] text-slate-500 font-medium">Level {student.level}</div>
                      </td>
                      <td className="p-4 text-slate-705 font-bold">
                        Files Submitted &bull; Pending Verification
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleApproveMedical(student.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl transition text-[10px] inline-flex items-center space-x-1 hover:scale-102 active:scale-98 shadow-sm cursor-pointer"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>Approve Clearance</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-slate-550 font-medium">
                      No pending medical clearances found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Medical Pagination Controls */}
          {totalMedicalPages > 1 && (
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-705">
                Showing {startMedicalIndex + 1} to {Math.min(startMedicalIndex + pageSize, totalMedical)} of {totalMedical} clearances
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMedicalPage((p) => Math.max(1, p - 1))}
                  disabled={activeMedicalPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition"
                >
                  Previous
                </button>
                <span className="font-bold text-slate-900">
                  Page {activeMedicalPage} of {totalMedicalPages}
                </span>
                <button
                  onClick={() => setMedicalPage((p) => Math.min(totalMedicalPages, p + 1))}
                  disabled={activeMedicalPage === totalMedicalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
