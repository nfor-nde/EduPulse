'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, HelpCircle, ArrowRight, Award, GraduationCap, Video, Users, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function StudentHomePage() {
  const { loggedInStudent } = useApp();

  const stats = [
    { label: 'Past Exam Papers', value: '1,200+', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Video Tutorials', value: '450+', icon: Video, color: 'text-amber-600 bg-amber-50' },
    { label: 'Active Students', value: '8,500+', icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'Faculties Covered', value: '8+', icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
  ];

  const benefits = [
    {
      title: 'Official Past Papers',
      desc: 'Get access to curated, official examination questions from previous semesters for all major faculties at UB.',
    },
    {
      title: 'Interactive Support Queue',
      desc: 'Submit, track, and interact with support agents regarding tuition issues, medical forms, or portal registration.',
    },
    {
      title: 'Video Lectures & Notes',
      desc: 'Browse lecture notes and embedded YouTube explanation playlists mapped specifically to University of Buea course codes.',
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-radial-gradient bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-8 md:p-16 shadow-2xl">
        {/* Subtle decorative background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-700/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-500/30 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>University of Buea Place of Excellence</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Your Academic Hub, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400">
              Simplified & Pulse-Checked.
            </span>
          </h1>

          <p className="text-lg text-blue-100 max-w-xl font-medium leading-relaxed">
            Welcome to EduPulse, the unified resource portal and support ticketing center built for the student body of the University of Buea.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <Link
              href="/resources"
              className="flex items-center justify-center space-x-2 bg-white text-blue-900 px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition text-base"
            >
              <span>Browse Resources</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/tickets"
              className="flex items-center justify-center space-x-2 bg-blue-700/40 border border-blue-500/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700/60 transition text-base"
            >
              <HelpCircle className="w-5 h-5 text-blue-300" />
              <span>Get Support Tickets</span>
            </Link>
          </div>
        </div>

        {loggedInStudent && (
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-medium max-w-xs hidden md:block">
            Logged in as <span className="font-bold text-blue-200">{loggedInStudent.name}</span>
          </div>
        )}
      </section>

      {/* Quick Stats Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">EduPulse by the Numbers</h2>
          <p className="text-sm text-gray-500">Helping UB students excel in their courses and clear administrative tasks efficiently.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-2.5 hover:shadow-md transition duration-300"
            >
              <div className={`p-3.5 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Benefits */}
      <section className="grid md:grid-cols-3 gap-8">
        {benefits.map((benefit, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 space-y-4"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-800" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </section>

      {/* Quick UB Links Info Banner */}
      <section className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold text-blue-900">Are you an Administrative Officer?</h3>
          <p className="text-sm text-gray-600">Access the executive CRM control desk to approve medical clearance and student support tickets.</p>
        </div>
        <Link
          href="/admin/overview"
          className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md shadow-blue-800/10 transition active:scale-95 whitespace-nowrap"
        >
          Go to Admin CRM
        </Link>
      </section>
    </div>
  );
}
