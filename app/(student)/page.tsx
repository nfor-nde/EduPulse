'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  AwardIcon,
  GraduationCapIcon,
  VideoIcon,
  UsersIcon,
  BookOpenIcon,
  CheckCircleIcon,
  SupportIcon
} from '@/components/icons';
import { useApp } from '@/context/AppContext';

export default function StudentHomePage() {
  const { loggedInStudent } = useApp();

  const stats = [
    { label: 'Past Exam Papers', value: '1,200+', icon: BookOpenIcon, color: 'text-blue-800 bg-blue-50 border-blue-100' },
    { label: 'Video Tutorials', value: '450+', icon: VideoIcon, color: 'text-amber-800 bg-amber-50 border-amber-100' },
    { label: 'Active Students', value: '8,500+', icon: UsersIcon, color: 'text-green-800 bg-green-50 border-green-100' },
    { label: 'Faculties Covered', value: '8+', icon: GraduationCapIcon, color: 'text-purple-800 bg-purple-50 border-purple-100' },
  ];

  const benefits = [
    {
      title: 'Official Past Papers',
      desc: 'Get access to curated, official examination questions from previous semesters for all major faculties.',
    },
    {
      title: 'Interactive Support Queue',
      desc: 'Submit, track, and interact with support agents regarding tuition issues, medical forms, or portal registration.',
    },
    {
      title: 'Video Lectures & Notes',
      desc: 'Browse lecture notes and embedded video explanation playlists mapped specifically to course curricula.',
    },
  ];

  return (
    <div className="space-y-16 py-4 bg-white text-slate-905">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-8 md:p-16 shadow-2xl">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-700/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-500/30 text-xs font-bold uppercase tracking-wider text-blue-200">
            <AwardIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Academic Portal Center</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Your Academic Hub, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
              Simplified & Pulse-Checked.
            </span>
          </h1>

          <p className="text-lg text-blue-100 max-w-xl font-medium leading-relaxed">
            Welcome to EduPulse, the unified resource library and support ticketing center built for student success.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Link
              href="/resources"
              className="flex items-center justify-center space-x-2 bg-white text-blue-900 px-8 py-4 rounded-2xl font-extrabold shadow-lg hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition text-sm cursor-pointer"
            >
              <span>Browse Resources</span>
              <ArrowRightIcon className="w-4 h-4 text-blue-800" />
            </Link>

            <Link
              href="/tickets"
              className="flex items-center justify-center space-x-2 bg-blue-700/40 border border-blue-500/30 text-white px-8 py-4 rounded-2xl font-extrabold hover:bg-blue-700/60 transition text-sm cursor-pointer"
            >
              <SupportIcon className="w-4 h-4 text-blue-300" />
              <span>Get Support Tickets</span>
            </Link>
          </div>
        </div>

        {loggedInStudent && (
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-semibold max-w-xs hidden md:block">
            Logged in as <span className="font-extrabold text-blue-200">{loggedInStudent.name}</span>
          </div>
        )}
      </section>

      {/* Quick Stats Grid */}
      <section className="space-y-6 bg-white">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">EduPulse Platform Analytics</h2>
          <p className="text-xs font-bold text-slate-700">Helping students excel in their courses and clear administrative tasks efficiently.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-2.5 hover:shadow-md hover:border-blue-300 transition duration-300"
            >
              <div className={`p-3.5 rounded-xl border ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Benefits */}
      <section className="grid md:grid-cols-3 gap-8 bg-white">
        {benefits.map((benefit, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition duration-300 space-y-4"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-blue-800" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">{benefit.title}</h3>
            <p className="text-xs font-bold text-slate-700 leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </section>

      {/* Admin Panel Quick Link Banner - Pure White themed */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8 shadow-xs">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-extrabold text-slate-900">Are you an Administrative Officer?</h3>
          <p className="text-xs font-bold text-slate-750">Access the CRM control desk to approve medical clearance and student support tickets.</p>
        </div>
        <Link
          href="/admin/overview"
          className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-md shadow-blue-800/10 transition active:scale-95 whitespace-nowrap cursor-pointer"
        >
          Go to Admin CRM
        </Link>
      </section>
    </div>
  );
}
