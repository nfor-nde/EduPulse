'use strict';
'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  X,
  Send,
  User,
  GraduationCap,
  Inbox,
  AlertTriangle
} from 'lucide-react';
import { Ticket } from '@/types';

export default function AdminSupportPage() {
  const { tickets, replyToTicket, updateTicketStatus, students } = useApp();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  // Find matching student details for active ticket to enrich dashboard metadata
  const activeStudentInfo = activeTicket
    ? students.find((s) => s.matricule === activeTicket.studentMatricule)
    : null;

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const currentId = activeTicket.id;
    await replyToTicket(currentId, replyText, 'admin');

    setReplyText('');
    
    // Re-sync active ticket
    const updated = tickets.find((t) => t.id === currentId);
    if (updated) {
      setActiveTicket(updated);
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    await updateTicketStatus(ticketId, 'closed');
    // Re-sync active ticket status
    const updated = tickets.find((t) => t.id === ticketId);
    if (updated) {
      setActiveTicket(updated);
    }
  };

  const handleReopenTicket = async (ticketId: string) => {
    await updateTicketStatus(ticketId, 'open');
    // Re-sync active ticket status
    const updated = tickets.find((t) => t.id === ticketId);
    if (updated) {
      setActiveTicket(updated);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Registrar Support Desk</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Review, assign and reply to claims submitted by students regarding academic registry or finance.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 1 Col: Tickets Queue list */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-extrabold text-gray-950 flex items-center space-x-2">
            <Inbox className="w-4 h-4 text-gray-400" />
            <span>Ticket Queue ({tickets.length})</span>
          </h2>

          <div className="bg-white border border-gray-250 rounded-2xl shadow-xs overflow-hidden divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {tickets.length > 0 ? (
              tickets.map((ticket) => {
                const student = students.find((s) => s.matricule === ticket.studentMatricule);
                const isSelected = activeTicket?.id === ticket.id;
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`w-full p-4 text-left hover:bg-blue-50/20 transition flex flex-col space-y-2.5 ${
                      isSelected ? 'bg-blue-50/40 border-l-4 border-blue-800' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">
                        {ticket.id}
                      </span>
                      {ticket.status === 'open' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          Open
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-700 border border-green-105">
                          Closed
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-black text-gray-900 truncate w-full">
                        {ticket.subject}
                      </p>
                      <p className="text-[10px] text-gray-500 font-bold">
                        {student ? student.name : ticket.studentMatricule}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                      <span>Submitted: {ticket.date}</span>
                      <span>{ticket.messages.length} replies</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-gray-500">No support tickets found.</div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Ticket Chat Console */}
        <div className="lg:col-span-2">
          {activeTicket ? (
            <div className="bg-white border border-gray-250 rounded-3xl shadow-xs overflow-hidden flex flex-col h-[550px]">
              {/* Header Details */}
              <div className="p-5 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-gray-500">{activeTicket.id}</span>
                    <span className="text-xs text-gray-400">&bull;</span>
                    <span className="text-xs font-medium text-gray-500">Student: {activeTicket.studentMatricule}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 mt-1">{activeTicket.subject}</h3>
                </div>

                {/* State toggle actions */}
                <div className="flex items-center space-x-2">
                  {activeTicket.status === 'open' ? (
                    <button
                      onClick={() => handleResolveTicket(activeTicket.id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm hover:scale-102 active:scale-98"
                    >
                      Mark as Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReopenTicket(activeTicket.id)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm hover:scale-102 active:scale-98"
                    >
                      Reopen Ticket
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTicket(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Grid: Split details and chat */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Chat Panel */}
                <div className="flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 overflow-hidden">
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/20 text-xs">
                    {activeTicket.messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex items-start space-x-2.5 ${
                          msg.sender === 'admin' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.sender === 'admin' ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {msg.sender === 'admin' ? (
                            <GraduationCap className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className="max-w-[75%]">
                          <div
                            className={`p-3 rounded-2xl ${
                              msg.sender === 'admin'
                                ? 'bg-blue-800 text-white rounded-tr-none'
                                : 'bg-white border border-gray-150 text-gray-800 rounded-tl-none shadow-xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-gray-400 mt-1 block px-1">
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
                      className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        placeholder="Type administrator response..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-blue-800"
                        required
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="bg-blue-800 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500 font-bold">
                      Resolve ticket closed. Reopen to reply.
                    </div>
                  )}
                </div>

                {/* Right Details Meta Sidebar */}
                {activeStudentInfo && (
                  <div className="w-full md:w-56 p-5 bg-gray-50/50 space-y-5 text-xs select-none">
                    <h4 className="font-extrabold text-gray-900 border-b border-gray-150 pb-2">Student Dossier</h4>
                    <div className="space-y-3.5">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Full Name</span>
                        <span className="font-bold text-gray-950">{activeStudentInfo.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Department</span>
                        <span className="font-medium text-gray-800">{activeStudentInfo.dept}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Level & Matricule</span>
                        <span className="font-medium text-gray-850">L{activeStudentInfo.level} &bull; {activeStudentInfo.matricule}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Tuition Status</span>
                        <span
                          className={`font-bold inline-block px-2 py-0.5 rounded-full text-[9px] mt-1 ${
                            activeStudentInfo.tuitionStatus === 'Paid'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {activeStudentInfo.tuitionStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold block uppercase">Medical Status</span>
                        <span
                          className={`font-bold inline-block px-2 py-0.5 rounded-full text-[9px] mt-1 ${
                            activeStudentInfo.medicalStatus === 'Cleared'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
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
            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl p-12 text-center text-xs text-gray-400 h-[550px] flex flex-col justify-center items-center space-y-3">
              <MessageSquare className="w-10 h-10 text-gray-300" />
              <span className="font-bold">Registrar Console Standby</span>
              <span>Select a support ticket from the queue list to review communications history.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
