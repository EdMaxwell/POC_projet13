export type TicketStatus = 'OPEN' | 'PENDING_CUSTOMER' | 'PENDING_AGENT' | 'CLOSED';

export type SenderType = 'CUSTOMER' | 'AGENT';

// New models for multi-user chat
export interface User {
  id: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  senderUserId: string;
  senderUsername: string;
  content: string;
  timestamp: string;
}

// Legacy models (kept for compatibility with existing UI)
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SupportAgent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Reservation {
  id: number;
  customerId: number;
  vehicleLabel: string;
  startDateTime: string;
  endDateTime: string;
}

export interface SupportTicket {
  id: number;
  customerId: number;
  reservationId: number;
  assignedAgentId: number;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  closedAt?: string | null;
}

export interface TicketMessage {
  id: number;
  ticketId: number;
  senderType: SenderType;
  senderCustomerId?: number | null;
  senderAgentId?: number | null;
  body: string;
  sentAt: string;
}
