'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, Resource, Ticket, Campaign, ActivityFeed } from '../types';

interface AppContextType {
  students: Student[];
  resources: Resource[];
  tickets: Ticket[];
  campaigns: Campaign[];
  activityFeed: ActivityFeed[];
  loggedInStudent: Student | null;
  isLoading: boolean;
  studentsLoading: boolean;
  resourcesLoading: boolean;
  ticketsLoading: boolean;
  campaignsLoading: boolean;
  login: (matricule: string, password: string) => Promise<boolean>;
  logout: () => void;
  createTicket: (subject: string, description: string) => Promise<void>;
  replyToTicket: (ticketId: string, text: string, sender: 'student' | 'admin') => Promise<void>;
  updateTicketStatus: (ticketId: string, status: 'open' | 'closed') => Promise<void>;
  markTuitionPaid: (studentId: string) => Promise<void>;
  approveMedicalClearance: (studentId: string) => Promise<void>;
  sendCampaign: (title: string, audience: string, message: string) => Promise<void>;
  refreshResources: (params?: Record<string, string>) => Promise<void>;
  refreshTickets: (matricule?: string) => Promise<void>;
  refreshStudents: (params?: Record<string, string>) => Promise<void>;
  refreshActivity: () => Promise<void>;
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
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(false);

  // --- Data Fetch Functions ---

  const refreshResources = useCallback(async (params: Record<string, string> = {}) => {
    setResourcesLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/resources${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error('refreshResources error:', err);
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  const refreshStudents = useCallback(async (params: Record<string, string> = {}) => {
    setStudentsLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/students${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('refreshStudents error:', err);
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  const refreshTickets = useCallback(async (matricule?: string) => {
    setTicketsLoading(true);
    try {
      const url = matricule ? `/api/tickets?matricule=${matricule}` : '/api/tickets';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error('refreshTickets error:', err);
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  const refreshCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error('refreshCampaigns error:', err);
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  const refreshActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/activity');
      if (!res.ok) throw new Error('Failed to fetch activity');
      const data = await res.json();
      setActivityFeed(data);
    } catch (err) {
      console.error('refreshActivity error:', err);
    }
  }, []);

  // Load all data on mount
  useEffect(() => {
    refreshResources();
    refreshStudents();
    refreshTickets();
    refreshCampaigns();
    refreshActivity();
  }, [refreshResources, refreshStudents, refreshTickets, refreshCampaigns, refreshActivity]);

  // --- Auth ---

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const login = async (matricule: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricule: matricule.trim(), password }),
      });

      if (!res.ok) {
        setIsLoading(false);
        return false;
      }

      const student: Student = await res.json();
      setLoggedInStudent(student);
      // Load this student's tickets
      await refreshTickets(student.matricule);
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setLoggedInStudent(null);
    refreshTickets(); // reset to all tickets
  };

  // --- Tickets ---

  const createTicket = async (subject: string, description: string): Promise<void> => {
    if (!loggedInStudent) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentMatricule: loggedInStudent.matricule,
          subject,
          description,
        }),
      });
      if (!res.ok) throw new Error('Failed to create ticket');
      // Refresh student's tickets and global activity
      await refreshTickets(loggedInStudent.matricule);
      await refreshActivity();
    } catch (err) {
      console.error('createTicket error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const replyToTicket = async (
    ticketId: string,
    text: string,
    sender: 'student' | 'admin'
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText: text, replyFrom: sender }),
      });
      if (!res.ok) throw new Error('Failed to reply to ticket');
      const updatedTicket: Ticket = await res.json();

      // Update in-memory tickets list
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? updatedTicket : t))
      );
      await refreshActivity();
    } catch (err) {
      console.error('replyToTicket error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketStatus = async (
    ticketId: string,
    status: 'open' | 'closed'
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update ticket status');
      const updatedTicket: Ticket = await res.json();

      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? updatedTicket : t))
      );
      await refreshActivity();
    } catch (err) {
      console.error('updateTicketStatus error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Students ---

  const markTuitionPaid = async (studentId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tuitionStatus: 'Paid' }),
      });
      if (!res.ok) throw new Error('Failed to update tuition status');
      const updatedStudent: Student = await res.json();

      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? updatedStudent : s))
      );

      if (loggedInStudent && loggedInStudent.id === studentId) {
        setLoggedInStudent(updatedStudent);
      }
      await refreshActivity();
    } catch (err) {
      console.error('markTuitionPaid error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const approveMedicalClearance = async (studentId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicalStatus: 'Cleared' }),
      });
      if (!res.ok) throw new Error('Failed to update medical status');
      const updatedStudent: Student = await res.json();

      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? updatedStudent : s))
      );

      if (loggedInStudent && loggedInStudent.id === studentId) {
        setLoggedInStudent(updatedStudent);
      }
      await refreshActivity();
    } catch (err) {
      console.error('approveMedicalClearance error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Campaigns ---

  const sendCampaign = async (
    title: string,
    audience: string,
    message: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, audience, message }),
      });
      if (!res.ok) throw new Error('Failed to send campaign');
      const newCampaign: Campaign = await res.json();

      setCampaigns((prev) => [newCampaign, ...prev]);
      await refreshActivity();
    } catch (err) {
      console.error('sendCampaign error:', err);
    } finally {
      setIsLoading(false);
    }
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
        studentsLoading,
        resourcesLoading,
        ticketsLoading,
        campaignsLoading,
        login,
        logout,
        createTicket,
        replyToTicket,
        updateTicketStatus,
        markTuitionPaid,
        approveMedicalClearance,
        sendCampaign,
        refreshResources,
        refreshTickets,
        refreshStudents,
        refreshActivity,
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
