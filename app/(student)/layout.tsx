'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, LogIn, LogOut, User, Menu, X, BookOpen, MessageSquare, Home } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { loggedInStudent, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Tickets', href: '/tickets', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50/40">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-800 flex items-center justify-center text-white shadow-md shadow-blue-800/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-lg text-gray-900 tracking-tight block leading-none">EduPulse</span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">University of Buea</span>
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-gray-600 hover:text-gray-950 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Auth / Matricule Info (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {loggedInStudent ? (
                <div className="flex items-center space-x-3 bg-gray-50 py-1.5 pl-3 pr-4 rounded-full border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs">
                    {loggedInStudent.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900 leading-none truncate max-w-[120px]">
                      {loggedInStudent.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">{loggedInStudent.matricule}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="p-1 hover:text-red-600 text-gray-400 transition"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/tickets"
                  className="flex items-center space-x-2 bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-md shadow-blue-800/10 text-sm font-semibold active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Student Login</span>
                </Link>
              )}

              {/* Admin Portal Link */}
              <Link
                href="/admin/overview"
                className="text-xs text-gray-500 hover:text-blue-800 font-semibold border-l border-gray-200 pl-4 py-1"
              >
                Admin CRM
              </Link>
            </div>

            {/* Mobile Hamburger Menu Trigger */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                href="/admin/overview"
                className="text-xs font-semibold text-gray-500 hover:text-blue-800 mr-2"
              >
                CRM
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-3 duration-200">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-blue-50 text-blue-800' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="border-t border-gray-100 my-2 pt-3">
              {loggedInStudent ? (
                <div className="flex flex-col space-y-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs">
                      {loggedInStudent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-none">{loggedInStudent.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{loggedInStudent.matricule}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      router.push('/');
                    }}
                    className="w-full mt-2 flex items-center justify-center space-x-2 text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/tickets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-800 text-white py-2.5 rounded-xl text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Student Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-800" />
            <span className="text-sm font-semibold text-gray-700">
              EduPulse UB &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-xs text-gray-500 font-medium">
            <Link href="/" className="hover:text-blue-800 transition">Home</Link>
            <Link href="/resources" className="hover:text-blue-800 transition">Resources</Link>
            <Link href="/tickets" className="hover:text-blue-800 transition">Support Tickets</Link>
            <Link href="/admin/overview" className="hover:text-blue-800 transition">Admin Dashboard</Link>
          </div>
          <div className="text-[10px] text-gray-400">
            University of Buea, Place of Excellence
          </div>
        </div>
      </footer>
    </div>
  );
}
