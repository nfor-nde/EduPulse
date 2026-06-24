'use strict';
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CreditCard, HeartPulse, Check, UserCheck, Search, Loader2 } from 'lucide-react';

export default function AdminFinancePage() {
  const { students, markTuitionPaid, approveMedicalClearance } = useApp();
  const [activeTab, setActiveTab] = useState<'tuition' | 'medical'>('tuition');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students based on current tab requirements and search query
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

  const handleMarkPaid = async (id: string) => {
    await markTuitionPaid(id);
  };

  const handleApproveMedical = async (id: string) => {
    await approveMedicalClearance(id);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Finance & Clearance</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Manage outstanding student tuition fees and approve clinical medical clearance documents.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('tuition');
            setSearchQuery('');
          }}
          className={`flex items-center space-x-2.5 pb-4 px-6 text-sm font-bold border-b-2 transition ${
            activeTab === 'tuition'
              ? 'border-blue-800 text-blue-850'
              : 'border-transparent text-gray-500 hover:text-gray-950'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tuition Management</span>
          <span className="bg-red-50 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-red-100">
            {students.filter((s) => s.tuitionStatus === 'Overdue').length} Overdue
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('medical');
            setSearchQuery('');
          }}
          className={`flex items-center space-x-2.5 pb-4 px-6 text-sm font-bold border-b-2 transition ${
            activeTab === 'medical'
              ? 'border-blue-800 text-blue-850'
              : 'border-transparent text-gray-500 hover:text-gray-950'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Medical Clearance</span>
          <span className="bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold border border-amber-100">
            {students.filter((s) => s.medicalStatus === 'Pending').length} Pending
          </span>
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Filter students by name or matricule..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-blue-800"
        />
      </div>

      {/* Tab Panels */}
      {activeTab === 'tuition' && (
        <div className="bg-white border border-gray-250 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800">Pending Tuition Payments Ledger</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Student</th>
                  <th className="p-4">Faculty / Department</th>
                  <th className="p-4">Outstanding Tuition</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {overdueTuitionList.length > 0 ? (
                  overdueTuitionList.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6">
                        <div className="font-extrabold text-gray-900">{student.name}</div>
                        <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                          {student.matricule}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{student.dept}</div>
                        <div className="text-[10px] text-gray-400">{student.faculty}</div>
                      </td>
                      <td className="p-4 font-bold text-red-700">
                        50,000 CFA Francs <span className="text-[10px] text-gray-450 font-normal">(Installment 2)</span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleMarkPaid(student.id)}
                          className="bg-blue-800 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition text-[10px] inline-flex items-center space-x-1 hover:scale-102 active:scale-98 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark as Paid</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-500 font-medium">
                      No outstanding tuition payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'medical' && (
        <div className="bg-white border border-gray-250 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800">Pending Physical Examination Files</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Student</th>
                  <th className="p-4">Department / Level</th>
                  <th className="p-4">Filing Date Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {pendingMedicalList.length > 0 ? (
                  pendingMedicalList.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 pl-6">
                        <div className="font-extrabold text-gray-900">{student.name}</div>
                        <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                          {student.matricule}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{student.dept}</div>
                        <div className="text-[10px] text-gray-400">Level {student.level}</div>
                      </td>
                      <td className="p-4 text-gray-500 font-medium">
                        Files submitted &bull; Pending verification
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => handleApproveMedical(student.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl transition text-[10px] inline-flex items-center space-x-1 hover:scale-102 active:scale-98 shadow-sm"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Approve Clearance</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-gray-500 font-medium">
                      No pending medical clearance certifications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
