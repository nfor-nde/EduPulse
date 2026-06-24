'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  LockIcon,
  PlusIcon,
  MessageSquareIcon,
  AlertCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XIcon,
  SendIcon,
  AlertTriangleIcon,
  UserIcon,
  GraduationCapIcon
} from '@/components/icons';
import { Ticket } from '@/types';

export default function StudentTicketsPage() {
  const {
    loggedInStudent,
    tickets,
    ticketsLoading,
    login,
    createTicket,
    replyToTicket,
    isLoading
  } = useApp();

  // Login form state
  const [matricule, setMatricule] = useState('EP2026-1234');
  const [password, setPassword] = useState('password');
  const [loginError, setLoginError] = useState('');

  // Ticket Modal state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  // Active Chat ticket detail state
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  const studentTickets = loggedInStudent
    ? tickets.filter((t) => t.studentMatricule === loggedInStudent.matricule)
    : [];

  // Sync active ticket when tickets list updates
  useEffect(() => {
    if (activeTicket) {
      const updated = tickets.find((t) => t.id === activeTicket.id);
      if (updated) setActiveTicket(updated);
    }
  }, [tickets, activeTicket?.id]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await login(matricule, password);
    if (!success) {
      setLoginError('Invalid Student ID or Password. Use your matricule and "password".');
    }
  };

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    await createTicket(ticketSubject, ticketDesc);
    setIsNewTicketOpen(false);
    setTicketSubject('');
    setTicketDesc('');
  };

  const handleSendReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const currentId = activeTicket.id;
    await replyToTicket(currentId, replyText, 'student');
    setReplyText('');
  };

  // Render Login Card if not logged in
  if (!loggedInStudent) {
    return (
      <div className="max-w-md mx-auto my-12 font-sans bg-white text-slate-900">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <LockIcon className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Student Portal Login</h2>
            <p className="text-xs text-slate-700">
              Enter your official credentials to view tuition, medical clearance status, and submit support tickets.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Student ID
              </label>
              <input
                type="text"
                placeholder="e.g. EP2026-1234"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-800 text-xs p-3.5 rounded-xl border border-red-200 flex items-start space-x-2">
                <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-800 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 cursor-pointer text-xs"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <span className="font-extrabold text-slate-800 block">Demo Account Credentials:</span>
            <p>Student ID: <code className="font-mono bg-slate-50 px-1 py-0.5 border border-slate-200 rounded text-blue-800 font-bold">EP2026-1234</code></p>
            <p>Password: <code className="font-mono bg-slate-50 px-1 py-0.5 border border-slate-200 rounded text-blue-800 font-bold">password</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Render Logged In portal
  return (
    <div className="space-y-8 font-sans bg-white text-slate-900">
      {/* Header Profile Dashboard */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-800 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md shadow-blue-800/10">
            {loggedInStudent.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
              {loggedInStudent.name}
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-1">
              {loggedInStudent.dept} &bull; Level {loggedInStudent.level}
            </p>
          </div>
        </div>

        {/* Mini Student Admin clearances */}
        <div className="flex items-center gap-3">
          {/* Tuition clear card */}
          <div className="flex-1 md:flex-initial bg-white border border-slate-200 rounded-2xl p-3 flex items-center space-x-3 pr-6">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                loggedInStudent.tuitionStatus === 'Paid'
                  ? 'bg-green-50 text-green-800 border border-green-100'
                  : 'bg-amber-50 text-amber-800 border border-amber-100'
              }`}
            >
              {loggedInStudent.tuitionStatus === 'Paid' ? (
                <CheckCircleIcon className="w-4 h-4" />
              ) : (
                <AlertTriangleIcon className="w-4 h-4" />
              )}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tuition</p>
              <p className="text-xs font-black text-slate-900">
                {loggedInStudent.tuitionStatus === 'Paid' ? 'Paid' : 'Overdue'}
              </p>
            </div>
          </div>

          {/* Medical clear card */}
          <div className="flex-1 md:flex-initial bg-white border border-slate-200 rounded-2xl p-3 flex items-center space-x-3 pr-6">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                loggedInStudent.medicalStatus === 'Cleared'
                  ? 'bg-green-50 text-green-800 border border-green-100'
                  : 'bg-amber-50 text-amber-800 border border-amber-100'
              }`}
            >
              {loggedInStudent.medicalStatus === 'Cleared' ? (
                <CheckCircleIcon className="w-4 h-4" />
              ) : (
                <ClockIcon className="w-4 h-4" />
              )}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Medical</p>
              <p className="text-xs font-black text-slate-900">
                {loggedInStudent.medicalStatus === 'Cleared' ? 'Cleared' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets List Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Ticket table list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">Support Ticket Queue</h2>
              <p className="text-xs text-slate-700">Submit requests regarding registry, courses, or clearances.</p>
            </div>
            <button
              onClick={() => setIsNewTicketOpen(true)}
              className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 active:scale-95 shadow-md shadow-blue-800/10 cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>

          {ticketsLoading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-xl"></div>
              ))}
            </div>
          ) : studentTickets.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      <th className="p-4 pl-6">Ticket ID</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 pr-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-900">
                    {studentTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => setActiveTicket(ticket)}
                        className={`hover:bg-blue-50/20 transition cursor-pointer ${
                          activeTicket?.id === ticket.id ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <td className="p-4 pl-6 font-mono font-bold text-slate-800">
                          #{ticket.id.slice(-6)}
                        </td>
                        <td className="p-4 font-bold text-slate-900 truncate max-w-[200px]">
                          {ticket.subject}
                        </td>
                        <td className="p-4">
                          {ticket.status === 'open' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                              Open
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-800 border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                              Closed
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-700 font-medium">{ticket.date}</td>
                        <td className="p-4 pr-6 text-right font-bold text-blue-800 hover:underline">
                          View Details
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm max-w-md mx-auto">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-500">
                <MessageSquareIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No support tickets</h3>
              <p className="text-xs text-slate-700">
                You haven&apos;t opened any support tickets yet. Click the button above to submit a claim.
              </p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Ticket details chat thread */}
        <div className="lg:col-span-1">
          {activeTicket ? (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[480px]">
              {/* Active Ticket Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">
                    #{activeTicket.id.slice(-6)}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-[180px]">
                    {activeTicket.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTicket(null)}
                  className="text-slate-700 hover:text-slate-950 transition cursor-pointer"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white text-xs">
                {activeTicket.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start space-x-2 ${
                      msg.sender === 'student' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'student' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {msg.sender === 'student' ? (
                        <UserIcon className="w-4 h-4" />
                      ) : (
                        <GraduationCapIcon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="max-w-[80%]">
                      <div
                        className={`p-2.5 rounded-2xl ${
                          msg.sender === 'student'
                            ? 'bg-blue-800 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-700 mt-1 block px-1 text-right font-medium">
                        {msg.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {activeTicket.status === 'open' ? (
                <form
                  onSubmit={handleSendReplySubmit}
                  className="p-3 border-t border-slate-200 flex items-center space-x-2 bg-white"
                >
                  <input
                    type="text"
                    placeholder="Type your reply message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || isLoading}
                    className="bg-blue-800 text-white p-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    <SendIcon className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-white border-t border-slate-200 text-center text-xs text-slate-700 font-bold">
                  This support ticket has been marked resolved.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-700 h-[480px] flex flex-col justify-center items-center space-y-2">
              <MessageSquareIcon className="w-8 h-8 text-slate-400" />
              <span className="font-bold">Select a Support Ticket</span>
              <span>Click a ticket from the queue list to review communications history.</span>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsNewTicketOpen(false)}
              className="absolute top-4 right-4 text-slate-700 hover:text-slate-950 transition cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Create Support Ticket</h3>
            <p className="text-xs text-slate-700 mb-6">
              Detail your administrative or financial issue. An administrator will attend to it.
            </p>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tuition fee verification claim"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Detailed Description
                </label>
                <textarea
                  placeholder="Provide transaction IDs, error codes, dates, and course codes where applicable..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:border-blue-800 h-28 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-md shadow-blue-800/10 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
