import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { MockChatDataService } from './mock-chat-data.service';
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
export class ChatService {
  private readonly LOGGED_IN_CUSTOMER_ID = 1;
  private readonly SIMULATED_AGENT_DELAY_MS = 2000;

  constructor(private mockDataService: MockChatDataService) {}

  getCurrentCustomer(): Observable<Customer | null> {
    const customer = this.mockDataService.getCustomer();
    return of(customer);
  }

  getAgent(): Observable<SupportAgent | null> {
    const agent = this.mockDataService.getAgent();
    return of(agent);
  }

  getReservation(): Observable<Reservation | null> {
    const reservation = this.mockDataService.getReservation(this.LOGGED_IN_CUSTOMER_ID);
    return of(reservation);
  }

  getTicket(): Observable<SupportTicket | null> {
    const ticket = this.mockDataService.getTicket(this.LOGGED_IN_CUSTOMER_ID);
    return of(ticket);
  }

  getMessages(ticketId: number): Observable<TicketMessage[]> {
    const messages = this.mockDataService.getMessages(ticketId);
    return of(messages);
  }

  sendCustomerMessage(ticketId: number, body: string): Observable<TicketMessage> {
    const message = this.mockDataService.addMessage(ticketId, body, 'CUSTOMER');
    
    const currentStatus = this.mockDataService.getTicketStatus(ticketId);
    if (currentStatus === 'OPEN' || currentStatus === 'PENDING_CUSTOMER') {
      this.mockDataService.updateTicketStatus(ticketId, 'PENDING_AGENT');
    }
    
    return of(message);
  }

  simulateAgentReply(ticketId: number): Observable<TicketMessage> {
    const agentResponses = [
      'We received your request, we will get back to you shortly.',
      'Thank you for your message. Our team is looking into this.',
      'I understand your concern. Let me check the details for you.',
      'We appreciate your patience. I will update you as soon as possible.'
    ];
    
    const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
    
    return of(null).pipe(
      delay(this.SIMULATED_AGENT_DELAY_MS),
      map(() => {
        const message = this.mockDataService.addMessage(ticketId, randomResponse, 'AGENT');
        this.mockDataService.updateTicketStatus(ticketId, 'PENDING_CUSTOMER');
        return message;
      })
    );
  }

  isTicketClosed(ticketId: number): Observable<boolean> {
    const status = this.mockDataService.getTicketStatus(ticketId);
    return of(status === 'CLOSED');
  }

  getTicketStatus(ticketId: number): Observable<TicketStatus | null> {
    const status = this.mockDataService.getTicketStatus(ticketId);
    return of(status);
  }
}
