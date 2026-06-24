'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageSquareIcon,
  XIcon,
  SendIcon,
  UserIcon,
  GraduationCapIcon,
  InboxIcon
} from '@/components/icons';
import { Ticket } from '@/types';

export default function AdminSupportPage() {
  const { tickets, replyToTicket, updateTicketStatus, students } = useApp();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  const activeStudentInfo = activeTicket
    ? students.find((s) => s.matricule === activeTicket.studentMatricule)
    : null;

  // Sync activeTicket whenever tickets list updates from API
  useEffect(() => {
    if (activeTicket) {
      const updated = tickets.find((t) => t.id === activeTicket.id);
      if (updated) setActiveTicket(updated);
    }
  }, [tickets, activeTicket?.id]);

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    await replyToTicket(activeTicket.id, replyText, 'admin');
    setReplyText('');
  };

  const handleResolveTicket = async (ticketId: string) => {
    await updateTicketStatus(ticketId, 'closed');
  };

  const handleReopenTicket = async (ticketId: string) => {
    await updateTicketStatus(ticketId, 'open');
  };

  return (
    <div className="space-y-8 font-sans bg-white text-slate-905">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Registrar Support Desk</h1>
        <p className="text-xs font-bold text-slate-700 max-w-2xl">
          Review, assign and reply to claims submitted by students regarding academic registry or finance.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 1 Col: Tickets Queue list */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <InboxIcon className="w-4 h-4 text-slate-500" />
            <span>Ticket Queue ({tickets.length})</span>
          </h2>

          <div className="bg-white border border-slate-250 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {tickets.length > 0 ? (
              tickets.map((ticket) => {
                const student = students.find((s) => s.matricule === ticket.studentMatricule);
                const isSelected = activeTicket?.id === ticket.id;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`w-full p-4 text-left hover:bg-blue-50/20 transition flex flex-col space-y-2.5 cursor-pointer ${
                      isSelected ? 'bg-blue-50/40 border-l-4 border-blue-805' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">
                        {ticket.id}
                      </span>
                      {ticket.status === 'open' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-800 border border-green-200">
                          Closed
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900 truncate w-full">
                        {ticket.subject}
                      </p>
                      <p className="text-[10px] text-slate-700 font-bold">
                        {student ? student.name : ticket.studentMatricule}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold pt-1">
                      <span>Submitted: {ticket.date}</span>
                      <span>{ticket.messages.length} replies</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">No support tickets found.</div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Ticket Chat Console */}
        <div className="lg:col-span-2">
          {activeTicket ? (
            <div className="bg-white border border-slate-250 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[550px]">
              {/* Header Details */}
              <div className="p-5 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-700">{activeTicket.id}</span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs font-bold text-slate-705">Student ID: {activeTicket.studentMatricule}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{activeTicket.subject}</h3>
                </div>

                {/* State toggle actions */}
                <div className="flex items-center space-x-2">
                  {activeTicket.status === 'open' ? (
                    <button
                      onClick={() => handleResolveTicket(activeTicket.id)}
                      className="bg-green-650 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm hover:scale-102 active:scale-98 cursor-pointer"
                    >
                      Mark as Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReopenTicket(activeTicket.id)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm hover:scale-102 active:scale-98 cursor-pointer"
                    >
                      Reopen Ticket
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTicket(null)}
                    className="p-2 text-slate-700 hover:text-slate-950 transition cursor-pointer"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Grid: Split details and chat */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
                {/* Chat Panel */}
                <div className="flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 overflow-hidden bg-white">
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white text-xs">
                    {activeTicket.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex items-start space-x-2.5 ${
                          msg.sender === 'admin' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.sender === 'admin' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {msg.sender === 'admin' ? (
                            <GraduationCapIcon className="w-4 h-4" />
                          ) : (
                            <UserIcon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="max-w-[75%]">
                          <div
                            className={`p-3 rounded-2xl ${
                              msg.sender === 'admin'
                                ? 'bg-blue-800 text-white rounded-tr-none'
                                : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-500 font-bold mt-1 block px-1">
                            {msg.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input form */}
                  {activeTicket.status === 'open' ? (
                    <form
                      onSubmit={handleSendAdminReply}
                      className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        placeholder="Type administrator response..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-200 bg-white text-slate-900 rounded-xl text-xs focus:outline-none focus:border-blue-800"
                        required
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="bg-blue-800 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                      >
                        <SendIcon className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-white border-t border-slate-200 text-center text-xs text-slate-700 font-bold">
                      Resolve ticket closed. Reopen to reply.
                    </div>
                  )}
                </div>

                {/* Right Details Meta Sidebar */}
                {activeStudentInfo && (
                  <div className="w-full md:w-56 p-5 bg-white border-l border-slate-100 space-y-5 text-xs select-none">
                    <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-2">Student Dossier</h4>
                    <div className="space-y-3.5">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Full Name</span>
                        <span className="font-bold text-slate-950">{activeStudentInfo.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Department</span>
                        <span className="font-bold text-slate-800">{activeStudentInfo.dept}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Level & ID</span>
                        <span className="font-bold text-slate-800">L{activeStudentInfo.level} &bull; {activeStudentInfo.matricule}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Tuition Status</span>
                        <span
                          className={`font-bold inline-block px-2 py-0.5 rounded-full text-[9px] mt-1 ${
                            activeStudentInfo.tuitionStatus === 'Paid'
                              ? 'bg-green-50 text-green-800 border border-green-205'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {activeStudentInfo.tuitionStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Medical Status</span>
                        <span
                          className={`font-bold inline-block px-2 py-0.5 rounded-full text-[9px] mt-1 ${
                            activeStudentInfo.medicalStatus === 'Cleared'
                              ? 'bg-green-50 text-green-805 border border-green-205'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {activeStudentInfo.medicalStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-xs text-slate-700 h-[550px] flex flex-col justify-center items-center space-y-3">
              <MessageSquareIcon className="w-10 h-10 text-slate-400" />
              <span className="font-bold">Support Console Standby</span>
              <span>Select a support ticket from the queue list to review communications history.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
