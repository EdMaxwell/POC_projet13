import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ChatSyncService } from '../../services/chat-sync.service';
import { ChatMessage, User, Reservation, SupportTicket } from '../../models/chat.models';

/**
 * SupportChatComponent displays the multi-user chat interface.
 * Messages are synchronized across browser tabs using localStorage and storage events.
 */
@Component({
  selector: 'app-support-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-chat.component.html',
  styleUrl: './support-chat.component.css'
})
export class SupportChatComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  messages: ChatMessage[] = [];
  newMessageText = '';
  isSending = false;

  // Mock data for UI display (kept from original PoC)
  reservation: Reservation = {
    id: 1,
    customerId: 1,
    vehicleLabel: 'Peugeot 208 - Compact',
    startDateTime: '2024-12-15T09:00:00Z',
    endDateTime: '2024-12-20T18:00:00Z'
  };

  ticket: SupportTicket = {
    id: 1,
    customerId: 1,
    reservationId: 1,
    assignedAgentId: 1,
    subject: 'Support Chat Conversation',
    status: 'OPEN',
    createdAt: new Date().toISOString(),
    closedAt: null
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private chatSyncService: ChatSyncService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Subscribe to messages from the sync service
    // This will update automatically when messages arrive from other tabs
    const messagesSub = this.chatSyncService.messages$.subscribe(messages => {
      this.messages = messages;
    });
    this.subscriptions.push(messagesSub);

    // Initialize with a welcome message if no messages exist
    if (this.messages.length === 0) {
      this.chatSyncService.initializeWithDefaultMessages();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Sends a message to the shared conversation.
   * The message will be automatically synchronized to other open tabs.
   */
  sendMessage(): void {
    if (!this.newMessageText.trim() || !this.currentUser || this.isSending) {
      return;
    }

    this.isSending = true;
    const messageContent = this.newMessageText.trim();
    this.newMessageText = '';

    try {
      // Send message via sync service
      this.chatSyncService.sendMessage(
        this.currentUser.id,
        this.currentUser.username,
        messageContent
      );
    } finally {
      this.isSending = false;
    }
  }

  /**
   * Logs out the current user and returns to login screen
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Formats an ISO timestamp to a human-readable date/time
   */
  formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const dateStr = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    return `${timeStr} - ${dateStr}`;
  }

  /**
   * Formats a reservation date
   */
  formatReservationDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  /**
   * Checks if a message was sent by the current user
   */
  isOwnMessage(message: ChatMessage): boolean {
    return this.currentUser?.id === message.senderUserId;
  }

  get isInputDisabled(): boolean {
    return this.isSending;
  }
}
