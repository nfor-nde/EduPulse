'use strict';
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Resource, Ticket, Campaign, ActivityFeed, Message } from '../types';
import { dummyStudents, dummyResources, dummyTickets, dummyCampaigns, dummyActivityFeed } from '../lib/dummy-data';

interface AppContextType {
  students: Student[];
  resources: Resource[];
  tickets: Ticket[];
  campaigns: Campaign[];
  activityFeed: ActivityFeed[];
  loggedInStudent: Student | null;
  isLoading: boolean;
  login: (matricule: string, password: string) => Promise<boolean>;
  logout: () => void;
  createTicket: (subject: string, description: string) => Promise<void>;
  replyToTicket: (ticketId: string, text: string, sender: 'student' | 'admin') => Promise<void>;
  updateTicketStatus: (ticketId: string, status: 'open' | 'closed') => Promise<void>;
  markTuitionPaid: (studentId: string) => Promise<void>;
  approveMedicalClearance: (studentId: string) => Promise<void>;
  sendCampaign: (title: string, audience: string, message: string) => Promise<void>;
  triggerLoading: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeed[]>([]);
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    setStudents(dummyStudents);
    setResources(dummyResources);
    setTickets(dummyTickets);
    setCampaigns(dummyCampaigns);
    setActivityFeed(dummyActivityFeed);
  }, []);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const login = async (matricule: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    const student = students.find(
      (s) => s.matricule.toLowerCase() === matricule.trim().toLowerCase()
    );
    if (student && password === 'password') {
      setLoggedInStudent(student);
      return true;
    }
    return false;
  };

  const logout = () => {
    setLoggedInStudent(null);
  };

  const createTicket = async (subject: string, description: string): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    if (!loggedInStudent) return;

    const newTicket: Ticket = {
      id: `t-${Math.floor(100 + Math.random() * 900)}`,
      studentMatricule: loggedInStudent.matricule,
      subject,
      description,
      status: 'open',
      date: new Date().toISOString().split('T')[0],
      messages: [
        {
          sender: 'student',
          text: description,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);

    const newActivity: ActivityFeed = {
      id: `a${Date.now()}`,
      action: `opened a support ticket: "${subject}"`,
      user: loggedInStudent.name,
      time: 'Just now',
    };
    setActivityFeed((prev) => [newActivity, ...prev]);
  };

  const replyToTicket = async (
    ticketId: string,
    text: string,
    sender: 'student' | 'admin'
  ): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const newMsg: Message = {
            sender,
            text,
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...ticket,
            messages: [...ticket.messages, newMsg],
          };
        }
        return ticket;
      })
    );

    // If student replied, post to activity feed
    if (sender === 'student' && loggedInStudent) {
      const newActivity: ActivityFeed = {
        id: `a${Date.now()}`,
        action: `replied to ticket "${ticketId}"`,
        user: loggedInStudent.name,
        time: 'Just now',
      };
      setActivityFeed((prev) => [newActivity, ...prev]);
    }
  };

  const updateTicketStatus = async (
    ticketId: string,
    status: 'open' | 'closed'
  ): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoading(false);

    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket))
    );

    const ticket = tickets.find((t) => t.id === ticketId);
    const newActivity: ActivityFeed = {
      id: `a${Date.now()}`,
      action: `${status === 'closed' ? 'resolved' : 'reopened'} ticket "${ticketId}"`,
      user: 'Administrator',
      time: 'Just now',
    };
    setActivityFeed((prev) => [newActivity, ...prev]);
  };

  const markTuitionPaid = async (studentId: string): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    let studentName = '';
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          studentName = student.name;
          return { ...student, tuitionStatus: 'Paid' };
        }
        return student;
      })
    );

    // If logged in student is the one getting paid, update session context too
    if (loggedInStudent && loggedInStudent.id === studentId) {
      setLoggedInStudent((prev) => (prev ? { ...prev, tuitionStatus: 'Paid' } : null));
    }

    if (studentName) {
      const newActivity: ActivityFeed = {
        id: `a${Date.now()}`,
        action: `updated tuition status to PAID`,
        user: studentName,
        time: 'Just now',
      };
      setActivityFeed((prev) => [newActivity, ...prev]);
    }
  };

  const approveMedicalClearance = async (studentId: string): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    let studentName = '';
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          studentName = student.name;
          return { ...student, medicalStatus: 'Cleared' };
        }
        return student;
      })
    );

    if (loggedInStudent && loggedInStudent.id === studentId) {
      setLoggedInStudent((prev) => (prev ? { ...prev, medicalStatus: 'Cleared' } : null));
    }

    if (studentName) {
      const newActivity: ActivityFeed = {
        id: `a${Date.now()}`,
        action: `approved medical clearance`,
        user: studentName,
        time: 'Just now',
      };
      setActivityFeed((prev) => [newActivity, ...prev]);
    }
  };

  const sendCampaign = async (
    title: string,
    audience: string,
    message: string
  ): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsLoading(false);

    const newCampaign: Campaign = {
      id: `c-${Math.floor(100 + Math.random() * 900)}`,
      title,
      audience,
      message,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'Sent',
    };

    setCampaigns((prev) => [newCampaign, ...prev]);

    const newActivity: ActivityFeed = {
      id: `a${Date.now()}`,
      action: `broadcasted campaign: "${title}" to ${audience}`,
      user: 'Administrator',
      time: 'Just now',
    };
    setActivityFeed((prev) => [newActivity, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        students,
        resources,
        tickets,
        campaigns,
        activityFeed,
        loggedInStudent,
        isLoading,
        login,
        logout,
        createTicket,
        replyToTicket,
        updateTicketStatus,
        markTuitionPaid,
        approveMedicalClearance,
        sendCampaign,
        triggerLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
