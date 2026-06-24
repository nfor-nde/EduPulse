'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SearchIcon, CheckCircleIcon, AlertCircleIcon } from '@/components/icons';

export default function AdminStudentsPage() {
  const { students } = useApp();
  const [searchVal, setSearchVal] = useState('');

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans bg-white text-slate-905">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Student Directory</h1>
        <p className="text-xs font-bold text-slate-700 max-w-2xl">
          Search and view student academic details, clearances, and contact parameters.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <SearchIcon className="absolute left-4 top-3 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search students by full name or matricule..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 bg-white text-slate-900 rounded-xl focus:outline-none focus:border-blue-800"
          />
        </div>
        <div className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
          Total: {filteredStudents.length} of {students.length} Students
        </div>
      </div>

      {/* Master Students Table */}
      <div className="bg-white border border-slate-250 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-[10px] font-bold text-slate-705 uppercase tracking-wider">
                <th className="p-4 pl-6">Student Info</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Faculty & Department</th>
                <th className="p-4">Level</th>
                <th className="p-4">Tuition Status</th>
                <th className="p-4">Medical Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-900">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/40 transition">
                    {/* Student Info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{student.name}</p>
                          <p className="text-[10px] font-mono text-slate-700 font-bold mt-0.5">
                            {student.matricule}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-900 font-medium">{student.instEmail}</p>
                      <p className="text-slate-500 font-bold text-[10px]">{student.phone}</p>
                    </td>

                    {/* Department / Faculty */}
                    <td className="p-4 space-y-0.5">
                      <p className="font-bold text-slate-900">{student.dept}</p>
                      <p className="text-[10px] text-slate-700 font-bold">{student.faculty}</p>
                    </td>

                    {/* Level */}
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-800 border border-slate-200">
                        Level {student.level}
                      </span>
                    </td>

                    {/* Tuition Status */}
                    <td className="p-4">
                      {student.tuitionStatus === 'Paid' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-800 border border-green-200">
                          <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-200">
                          <AlertCircleIcon className="w-3.5 h-3.5 mr-1" />
                          Overdue
                        </span>
                      )}
                    </td>

                    {/* Medical Status */}
                    <td className="p-4">
                      {student.medicalStatus === 'Cleared' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-800 border border-green-200">
                          <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                          Cleared
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertCircleIcon className="w-3.5 h-3.5 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-550 font-medium">
                    No students found matching search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
