'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCapIcon,
  LogOutIcon,
  LogInIcon,
  MenuIcon,
  XIcon,
  BookOpenIcon,
  MessageSquareIcon,
  HomeIcon
} from '@/components/icons';
import { useApp } from '@/context/AppContext';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { loggedInStudent, logout, sessionLoading } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Resources', href: '/resources', icon: BookOpenIcon },
    { name: 'Tickets', href: '/tickets', icon: MessageSquareIcon },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center text-white shadow-md shadow-blue-800/20">
                  <GraduationCapIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-none">EduPulse</span>
                  <span className="text-[10px] text-slate-700 font-bold tracking-wide uppercase">Academic Portal</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-900 border border-blue-100'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-blue-800" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth / Student ID Info (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {sessionLoading ? (
                <div className="w-28 h-8 bg-slate-100 rounded-full animate-pulse"></div>
              ) : loggedInStudent ? (
                <div className="flex items-center space-x-3 bg-white py-1.5 pl-3 pr-4 rounded-full border border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs">
                    {loggedInStudent.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-slate-900 leading-none truncate max-w-[120px]">
                      {loggedInStudent.name}
                    </p>
                    <p className="text-[10px] text-slate-700 font-mono font-bold mt-0.5">{loggedInStudent.matricule}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="p-1 hover:text-red-600 text-slate-500 transition cursor-pointer"
                    title="Log Out"
                  >
                    <LogOutIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/tickets"
                  className="flex items-center space-x-2 bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-md shadow-blue-800/10 text-xs font-bold active:scale-95"
                >
                  <LogInIcon className="w-4 h-4" />
                  <span>Student Login</span>
                </Link>
              )}

              {/* Admin Portal Link */}
              <Link
                href="/admin/overview"
                className="text-xs text-slate-700 hover:text-blue-800 font-bold border-l border-slate-200 pl-4 py-1"
              >
                Admin CRM
              </Link>
            </div>

            {/* Mobile Hamburger Menu Trigger */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                href="/admin/overview"
                className="text-xs font-bold text-slate-700 hover:text-blue-800 mr-2"
              >
                CRM
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-3 duration-200">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold ${
                    isActive ? 'bg-blue-50 text-blue-900 border border-blue-100' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 text-blue-800" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="border-t border-slate-200 my-2 pt-3">
              {loggedInStudent ? (
                <div className="flex flex-col space-y-2 px-4 py-2 bg-white rounded-2xl border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs">
                      {loggedInStudent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 leading-none">{loggedInStudent.name}</p>
                      <p className="text-[10px] text-slate-700 font-mono font-bold mt-0.5">{loggedInStudent.matricule}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      router.push('/');
                    }}
                    className="w-full mt-2 flex items-center justify-center space-x-2 text-red-650 bg-red-50 hover:bg-red-100 py-2 rounded-xl text-xs font-bold transition border border-red-150 cursor-pointer"
                  >
                    <LogOutIcon className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/tickets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-800 text-white py-2.5 rounded-xl text-xs font-bold"
                >
                  <LogInIcon className="w-4 h-4" />
                  <span>Student Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area - White background */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <GraduationCapIcon className="w-5 h-5 text-blue-800" />
            <span className="text-xs font-bold text-slate-800">
              EduPulse &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-xs text-slate-700 font-bold">
            <Link href="/" className="hover:text-blue-800 transition">Home</Link>
            <Link href="/resources" className="hover:text-blue-800 transition">Resources</Link>
            <Link href="/tickets" className="hover:text-blue-800 transition">Support Tickets</Link>
            <Link href="/admin/overview" className="hover:text-blue-800 transition">Admin Dashboard</Link>
          </div>
          <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">
            Academic Portal Console
          </div>
        </div>
      </footer>
    </div>
  );
}
