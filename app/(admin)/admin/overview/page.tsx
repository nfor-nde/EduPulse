'use strict';
'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  CreditCard,
  HeartPulse,
  LifeBuoy,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { students, tickets, activityFeed } = useApp();

  // Compute live stats from Context
  const totalStudents = students.length;
  const overdueTuition = students.filter((s) => s.tuitionStatus === 'Overdue').length;
  const pendingMedical = students.filter((s) => s.medicalStatus === 'Pending').length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;

  const stats = [
    {
      label: 'Total Students',
      value: totalStudents,
      subtext: 'Registered this semester',
      icon: Users,
      color: 'bg-blue-50 text-blue-800 border-blue-100',
      link: '/admin/students',
    },
    {
      label: 'Overdue Tuition',
      value: overdueTuition,
      subtext: 'Awaiting balance payments',
      icon: CreditCard,
      color: 'bg-red-50 text-red-850 border-red-100',
      link: '/admin/finance',
    },
    {
      label: 'Pending Medical',
      value: pendingMedical,
      subtext: 'Requires health screening',
      icon: HeartPulse,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
      link: '/admin/finance',
    },
    {
      label: 'Open Support Tickets',
      value: openTickets,
      subtext: 'Awaiting agent response',
      icon: LifeBuoy,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-100',
      link: '/admin/support',
    },
  ];

  // Visual tuition progress (percentage paid)
  const paidCount = students.filter((s) => s.tuitionStatus === 'Paid').length;
  const tuitionPaidPercent = totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0;

  // Visual medical clearance progress
  const clearedCount = students.filter((s) => s.medicalStatus === 'Cleared').length;
  const medicalClearedPercent = totalStudents > 0 ? Math.round((clearedCount / totalStudents) * 100) : 0;

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">CRM Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time analytics and student records console for the University of Buea.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-xs text-blue-800 font-bold">
          <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Interactive Session Simulated</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.link}
            className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-xl border ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-blue-800 transition">
                  {stat.value}
                </p>
                <p className="text-[10px] text-gray-500 font-medium mt-1">
                  {stat.subtext}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-blue-800 opacity-0 group-hover:opacity-100 transition duration-300">
              <span>View details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Mini-Charts clearance meters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <h2 className="text-lg font-extrabold text-gray-900">Clearance Completion Rates</h2>

            {/* Tuition meter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Tuition Fees Clearance</span>
                <span className="font-bold text-blue-800">{tuitionPaidPercent}% Cleared ({paidCount}/{totalStudents} students)</span>
              </div>
              <div className="w-full bg-gray-150 h-3.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-800 h-full rounded-full transition-all duration-700"
                  style={{ width: `${tuitionPaidPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Medical meter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Medical Examination Clearance</span>
                <span className="font-bold text-green-700">{medicalClearedPercent}% Cleared ({clearedCount}/{totalStudents} students)</span>
              </div>
              <div className="w-full bg-gray-150 h-3.5 rounded-full overflow-hidden">
                <div
                  className="bg-green-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${medicalClearedPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Platform Health Quick Info */}
            <div className="bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl flex items-start space-x-3 text-xs text-blue-800">
              <ShieldCheck className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">System Status: Optimal</p>
                <p className="text-gray-500 font-medium mt-0.5">
                  EduPulse portal interfaces are synced. Any update on support status or financial records made inside tabs will immediately update the active student sessions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity feed */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col h-full">
            <div className="flex items-center space-x-2 pb-4 border-b border-gray-100">
              <Clock className="w-4 h-4 text-gray-400" />
              <h2 className="text-base font-extrabold text-gray-900">Recent Activity</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 text-xs">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-800 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-gray-800">
                      <span className="font-bold text-gray-950">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
