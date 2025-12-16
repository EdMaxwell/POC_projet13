import { Injectable } from '@angular/core';
import {
  Customer,
  SupportAgent,
  Reservation,
  SupportTicket,
  TicketMessage,
  TicketStatus
} from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class MockChatDataService {
  private customer: Customer = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com'
  };

  private agent: SupportAgent = {
    id: 1,
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@carrental.com'
  };

  private reservation: Reservation = {
    id: 1,
    customerId: 1,
    vehicleLabel: 'Peugeot 208 - Compact',
    startDateTime: '2024-12-15T09:00:00Z',
    endDateTime: '2024-12-20T18:00:00Z'
  };

  private ticket: SupportTicket = {
    id: 1,
    customerId: 1,
    reservationId: 1,
    assignedAgentId: 1,
    subject: 'Question about my upcoming reservation',
    status: 'OPEN',
    createdAt: '2024-12-10T10:30:00Z',
    closedAt: null
  };

  private messages: TicketMessage[] = [
    {
      id: 1,
      ticketId: 1,
      senderType: 'CUSTOMER',
      senderCustomerId: 1,
      senderAgentId: null,
      body: 'Hello, I have a question about my reservation. Can I pick up the car earlier than 9 AM?',
      sentAt: '2024-12-10T10:30:00Z'
    },
    {
      id: 2,
      ticketId: 1,
      senderType: 'AGENT',
      senderCustomerId: null,
      senderAgentId: 1,
      body: 'Hello Jean! Thank you for contacting us. I would be happy to help you with your reservation. Early pickup is possible starting from 7 AM, subject to availability. Would you like me to check if this option is available for your reservation date?',
      sentAt: '2024-12-10T11:15:00Z'
    },
    {
      id: 3,
      ticketId: 1,
      senderType: 'CUSTOMER',
      senderCustomerId: 1,
      senderAgentId: null,
      body: 'Yes, please! That would be great. I need to catch an early flight connection.',
      sentAt: '2024-12-10T11:45:00Z'
    }
  ];

  private nextMessageId = 4;

  getCustomer(): Customer {
    return { ...this.customer };
  }

  getAgent(): SupportAgent {
    return { ...this.agent };
  }

  getReservation(customerId: number): Reservation | null {
    if (this.reservation.customerId === customerId) {
      return { ...this.reservation };
    }
    return null;
  }

  getTicket(customerId: number): SupportTicket | null {
    if (this.ticket.customerId === customerId) {
      return { ...this.ticket };
    }
    return null;
  }

  getMessages(ticketId: number): TicketMessage[] {
    return this.messages
      .filter(m => m.ticketId === ticketId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
      .map(m => ({ ...m }));
  }

  addMessage(ticketId: number, body: string, senderType: 'CUSTOMER' | 'AGENT'): TicketMessage {
    const newMessage: TicketMessage = {
      id: this.nextMessageId++,
      ticketId,
      senderType,
      senderCustomerId: senderType === 'CUSTOMER' ? this.customer.id : null,
      senderAgentId: senderType === 'AGENT' ? this.agent.id : null,
      body,
      sentAt: new Date().toISOString()
    };
    this.messages.push(newMessage);
    return { ...newMessage };
  }

  updateTicketStatus(ticketId: number, status: TicketStatus): void {
    if (this.ticket.id === ticketId) {
      this.ticket.status = status;
      if (status === 'CLOSED') {
        this.ticket.closedAt = new Date().toISOString();
      }
    }
  }

  getTicketStatus(ticketId: number): TicketStatus | null {
    if (this.ticket.id === ticketId) {
      return this.ticket.status;
    }
    return null;
  }
}
