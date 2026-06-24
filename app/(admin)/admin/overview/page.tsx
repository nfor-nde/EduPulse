'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  UsersIcon,
  CreditCardIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DashboardIcon,
  SupportIcon,
  HistoryIcon,
  ClockIcon
} from '@/components/icons';
import Link from 'next/link';

export default function AdminOverviewPage() {
  const { students, tickets, activityFeed } = useApp();

  const totalStudents = students.length;
  const overdueTuition = students.filter((s) => s.tuitionStatus === 'Overdue').length;
  const pendingMedical = students.filter((s) => s.medicalStatus === 'Pending').length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;

  const stats = [
    {
      label: 'Total Students',
      value: totalStudents,
      subtext: 'Registered this semester',
      icon: UsersIcon,
      color: 'bg-blue-50 text-blue-805 border-blue-100',
      link: '/admin/students',
    },
    {
      label: 'Overdue Tuition',
      value: overdueTuition,
      subtext: 'Outstanding balances',
      icon: CreditCardIcon,
      color: 'bg-red-50 text-red-800 border-red-100',
      link: '/admin/finance',
    },
    {
      label: 'Pending Medical',
      value: pendingMedical,
      subtext: 'Awaiting health screening',
      icon: SupportIcon,
      color: 'bg-amber-50 text-amber-800 border-amber-100',
      link: '/admin/finance',
    },
    {
      label: 'Open Support Tickets',
      value: openTickets,
      subtext: 'Awaiting administrator action',
      icon: SupportIcon,
      color: 'bg-indigo-50 text-indigo-805 border-indigo-100',
      link: '/admin/support',
    },
  ];

  const paidCount = students.filter((s) => s.tuitionStatus === 'Paid').length;
  const tuitionPaidPercent = totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0;

  const clearedCount = students.filter((s) => s.medicalStatus === 'Cleared').length;
  const medicalClearedPercent = totalStudents > 0 ? Math.round((clearedCount / totalStudents) * 100) : 0;

  return (
    <div className="space-y-8 font-sans bg-white text-slate-905">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">CRM Overview</h1>
          <p className="text-xs font-bold text-slate-700 mt-1">
            Real-time analytics and student records console for academic administration.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-xs text-blue-900 font-bold">
          <span>Active Session Synced</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.link}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-xl border ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-800 transition">
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-700 font-bold mt-1">
                  {stat.subtext}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold text-blue-850 opacity-0 group-hover:opacity-100 transition duration-300">
              <span>View details</span>
              <ArrowRightIcon className="w-3.5 h-3.5 text-blue-800" />
            </div>
          </Link>
        ))}
      </div>

      {/* Analytics and Activity Feed - aligned height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Clearance Completion Rates */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-[380px] flex flex-col justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Clearance Completion Rates</h2>
              <p className="text-xs text-slate-700 mt-0.5">Tracking student clearance progression for the current session.</p>
            </div>

            <div className="space-y-5 flex-1 flex flex-col justify-center">
              {/* Tuition meter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Tuition Fees Clearance</span>
                  <span className="font-bold text-blue-800">{tuitionPaidPercent}% Cleared ({paidCount}/{totalStudents} students)</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-blue-800 h-full rounded-full transition-all duration-700"
                    style={{ width: `${tuitionPaidPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Medical meter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Medical Examination Clearance</span>
                  <span className="font-bold text-green-800">{medicalClearedPercent}% Cleared ({clearedCount}/{totalStudents} students)</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-green-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${medicalClearedPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Platform Health Quick Info */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start space-x-3 text-xs text-blue-900">
              <CheckCircleIcon className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">System Status: Synchronized</p>
                <p className="text-[10px] text-slate-700 font-bold mt-0.5">
                  EduPulse interfaces are fully synced. Updates inside clearance ledgers immediately propagate to student dashboards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity feed - scrollable, same height */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[380px]">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-200 flex-shrink-0">
              <ClockIcon className="w-4 h-4 text-slate-500" />
              <h2 className="text-base font-extrabold text-slate-900">Recent Activity</h2>
            </div>
            
            {/* Scrollable list container */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 text-xs">
              {activityFeed.length > 0 ? (
                activityFeed.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 border-b border-slate-50 pb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-800 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-slate-800 leading-normal">
                        <span className="font-bold text-slate-950">{activity.user}</span>{' '}
                        {activity.action}
                      </p>
                      <span className="text-[10px] text-slate-500 font-bold mt-1 block">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 font-medium">No recent activities.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
