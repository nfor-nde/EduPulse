'use strict';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CreditCard,
  Megaphone,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tickets, students } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Stats for indicators
  const openTicketsCount = tickets.filter((t) => t.status === 'open').length;
  const overdueTuitionCount = students.filter((s) => s.tuitionStatus === 'Overdue').length;

  const menuItems = [
    {
      name: 'Overview',
      href: '/admin/overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Students',
      href: '/admin/students',
      icon: Users,
      badge: students.length,
    },
    {
      name: 'Finance',
      href: '/admin/finance',
      icon: CreditCard,
      badge: overdueTuitionCount > 0 ? overdueTuitionCount : null,
    },
    {
      name: 'Campaigns',
      href: '/admin/campaigns',
      icon: Megaphone,
      badge: null,
    },
    {
      name: 'Support',
      href: '/admin/support',
      icon: LifeBuoy,
      badge: openTicketsCount > 0 ? openTicketsCount : null,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 relative ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100 justify-between">
          <Link href="/" className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-800 flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="transition duration-300">
                <span className="font-bold text-sm text-gray-900 tracking-tight block leading-none">
                  EduPulse CRM
                </span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide">
                  UB Administration
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition group ${
                  isActive
                    ? 'bg-blue-50 text-blue-850'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={`w-4 h-4 flex-shrink-0 transition ${
                      isActive ? 'text-blue-800' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>

                {!isCollapsed && item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      item.name === 'Support' || item.name === 'Finance'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute bottom-6 -right-3.5 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)}></div>
          <aside className="relative w-64 bg-white flex flex-col p-4 animate-in slide-in-from-left duration-200 shadow-2xl">
            <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-blue-800 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-gray-900 tracking-tight block leading-none">
                  EduPulse CRM
                </span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">
                  UB Administration
                </span>
              </div>
            </div>

            <nav className="space-y-1.5 flex-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive ? 'bg-blue-50 text-blue-850' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-800' : 'text-gray-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== null && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/"
                className="w-full flex items-center space-x-2 justify-center py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit CRM portal</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <header className="h-16 bg-white border-b border-gray-250 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-xl md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block text-xs text-gray-400 font-semibold uppercase tracking-wider">
              University of Buea CRM Desk
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick alert notifications indicator */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-50 rounded-full text-gray-500 hover:text-gray-800 transition">
                <Bell className="w-4 h-4" />
                {openTicketsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Profile widget */}
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-gray-900 leading-none">Admin Control Desk</p>
                <p className="text-[9px] text-gray-500 uppercase mt-0.5 font-bold">Registrar Desk</p>
              </div>
              <Link
                href="/"
                className="p-1.5 text-gray-400 hover:text-red-600 transition"
                title="Exit Dashboard"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Pages wrapper */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
