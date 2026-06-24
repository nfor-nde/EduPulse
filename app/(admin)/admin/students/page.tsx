'use strict';
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, GraduationCap, Mail, Phone, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminStudentsPage() {
  const { students } = useApp();
  const [searchVal, setSearchVal] = useState('');

  // Filter students based on search term (name or matricule)
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Student Directory</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Search and view student academic details, faculties, departments, and financial/medical clearances.
        </p>
      </div>

      {/* Directory Search controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search students by full name or matricule..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-blue-800 bg-gray-50/50"
          />
        </div>
        <div className="text-xs font-bold text-gray-500 whitespace-nowrap bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
          Showing {filteredStudents.length} of {students.length} Students
        </div>
      </div>

      {/* Master Students Table */}
      <div className="bg-white border border-gray-250 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Student Info</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Faculty & Department</th>
                <th className="p-4">Level</th>
                <th className="p-4">Tuition Status</th>
                <th className="p-4">Medical status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition">
                    {/* Student Info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900">{student.name}</p>
                          <p className="text-[10px] font-mono text-gray-500 mt-0.5">
                            {student.matricule}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center space-x-1.5 text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{student.instEmail}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{student.phone}</span>
                      </div>
                    </td>

                    {/* Department / Faculty */}
                    <td className="p-4 space-y-0.5">
                      <p className="font-bold text-gray-800">{student.dept}</p>
                      <p className="text-[10px] text-gray-400">{student.faculty}</p>
                    </td>

                    {/* Level */}
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                        Level {student.level}
                      </span>
                    </td>

                    {/* Tuition Status */}
                    <td className="p-4">
                      {student.tuitionStatus === 'Paid' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-105">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Overdue
                        </span>
                      )}
                    </td>

                    {/* Medical Status */}
                    <td className="p-4">
                      {student.medicalStatus === 'Cleared' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Cleared
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500 font-medium">
                    No students found matching your criteria.
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
