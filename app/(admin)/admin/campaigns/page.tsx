'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MegaphoneIcon, SendIcon, CheckCircleIcon, HistoryIcon } from '@/components/icons';

export default function AdminCampaignsPage() {
  const { campaigns, sendCampaign } = useApp();

  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('All Students');
  const [message, setMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    await sendCampaign(title, audience, message);

    setToastMessage(`Campaign "${title}" successfully broadcasted!`);
    setTitle('');
    setMessage('');
    setAudience('All Students');

    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-8 font-sans bg-white text-slate-905">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Broadcast Campaigns</h1>
        <p className="text-xs font-bold text-slate-700 max-w-2xl">
          Draft and broadcast notification bulletins and announcements targeting specific student cohorts.
        </p>
      </div>

      {/* Toast Alert Success */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs animate-in fade-in slide-in-from-top-3 duration-350 border border-green-700">
          <CheckCircleIcon className="w-5 h-5 text-white flex-shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Broadcast Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form: Draft Broadcast */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-250 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <MegaphoneIcon className="w-5 h-5 text-blue-800" />
            <h2 className="text-base font-extrabold text-slate-900">Draft Announcement</h2>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-705 uppercase tracking-wide">
                Campaign Title
              </label>
              <input
                type="text"
                placeholder="e.g. Tuition Payment Deadline Extension"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-xl focus:outline-none focus:border-blue-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-705 uppercase tracking-wide">
                Target Cohort
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:border-blue-800"
              >
                <option value="All Students">All Students</option>
                <option value="Level 100">Level 100 Students</option>
                <option value="Level 200">Level 200 Students</option>
                <option value="Level 300">Level 300 Students</option>
                <option value="Level 400">Level 400 Students</option>
                <option value="Faculty of Engineering and Technology">Faculty of Engineering Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-705 uppercase tracking-wide">
                Bulletin Message
              </label>
              <textarea
                placeholder="Write your push announcement. Keep it clear and concise..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-xl focus:outline-none focus:border-blue-800 h-28 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 active:scale-98 shadow-md shadow-blue-800/10 cursor-pointer"
            >
              <SendIcon className="w-4 h-4" />
              <span>Send Campaign</span>
            </button>
          </form>
        </div>

        {/* Right Table: Past Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <HistoryIcon className="w-4 h-4 text-slate-500" />
            <h2 className="text-lg font-extrabold text-slate-900">Campaign History</h2>
          </div>

          <div className="bg-white border border-slate-250 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="p-4 pl-6">Campaign Info</th>
                    <th className="p-4">Target cohort</th>
                    <th className="p-4">Broadcast Message</th>
                    <th className="p-4 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-900">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/20 transition">
                      <td className="p-4 pl-6 font-bold text-slate-900">
                        <p className="font-extrabold text-slate-900 truncate max-w-[150px]">{camp.title}</p>
                        <span className="text-[10px] text-slate-500 font-bold">{camp.sentDate}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                          {camp.audience}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 line-clamp-2 max-w-[200px] leading-relaxed pt-6">
                        {camp.message}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {camp.status === 'Sent' ? (
                          <span className="inline-flex items-center text-[10px] font-extrabold text-green-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                            Broadcasted
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-bold text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                            Draft
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
