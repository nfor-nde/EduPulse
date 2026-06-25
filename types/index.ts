export interface Student {
  id: string;
  name: string;
  matricule: string;
  instEmail: string;
  personalEmail: string;
  phone: string;
  faculty: string;
  dept: string;
  level: number;
  tuitionStatus: 'Paid' | 'Overdue';
  medicalStatus: 'Cleared' | 'Pending';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pastpaper' | 'notes' | 'youtube';
  url: string;
  faculty: string;
  dept: string;
  level: number;
}

export interface StudentInteraction {
  id: string;
  studentId: string;
  resourceId: string;
  action: 'view' | 'click' | 'download' | 'complete' | 'search';
  duration?: number | null;
  metadata?: string | null;
  createdAt: string;
}

export interface Message {
  sender: 'student' | 'admin';
  text: string;
  date: string;
}

export interface Ticket {
  id: string;
  studentMatricule: string;
  subject: string;
  description: string;
  status: 'open' | 'closed';
  date: string;
  messages: Message[];
}

export interface Campaign {
  id: string;
  title: string;
  audience: string;
  message: string;
  sentDate: string;
  status: 'Sent' | 'Draft';
}

export interface ActivityFeed {
  id: string;
  action: string;
  user: string;
  time: string;
}
