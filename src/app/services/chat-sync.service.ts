import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat.models';

/**
 * ChatSyncService manages message storage and cross-tab synchronization.
 * It uses localStorage to store messages and the storage event to sync between tabs.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatSyncService implements OnDestroy {
  private readonly MESSAGES_STORAGE_KEY = 'chat_messages';
  private messagesSubject: BehaviorSubject<ChatMessage[]>;
  public messages$: Observable<ChatMessage[]>;
  private storageListener: (event: StorageEvent) => void;

  constructor() {
    // Initialize with messages from localStorage
    const storedMessages = this.getMessagesFromStorage();
    this.messagesSubject = new BehaviorSubject<ChatMessage[]>(storedMessages);
    this.messages$ = this.messagesSubject.asObservable();

    // Listen for storage events from other tabs
    // This enables real-time synchronization across browser windows/tabs
    this.storageListener = (event: StorageEvent) => {
      if (event.key === this.MESSAGES_STORAGE_KEY && event.newValue) {
        try {
          const messages = JSON.parse(event.newValue) as ChatMessage[];
          this.messagesSubject.next(messages);
        } catch {
          // Invalid JSON, ignore
        }
      }
    };
    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy(): void {
    // Clean up storage listener to prevent memory leaks
    window.removeEventListener('storage', this.storageListener);
  }

  /**
   * Retrieves all messages from the shared conversation
   */
  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  /**
   * Sends a new message to the conversation.
   * The message is stored in localStorage and will be automatically
   * synchronized to other open tabs via the storage event.
   */
  sendMessage(senderUserId: string, senderUsername: string, content: string): ChatMessage {
    const newMessage: ChatMessage = {
      id: this.generateMessageId(),
      senderUserId,
      senderUsername,
      content,
      timestamp: new Date().toISOString()
    };

    const currentMessages = this.messagesSubject.value;
    const updatedMessages = [...currentMessages, newMessage];
    
    // Store in localStorage (this will trigger storage event in other tabs)
    this.saveMessagesToStorage(updatedMessages);
    
    // Update local state
    this.messagesSubject.next(updatedMessages);

    return newMessage;
  }

  /**
   * Clears all messages from the conversation (for testing/demo purposes)
   */
  clearMessages(): void {
    this.saveMessagesToStorage([]);
    this.messagesSubject.next([]);
  }

  /**
   * Initializes the conversation with some default messages (for demo purposes)
   */
  initializeWithDefaultMessages(): void {
    const defaultMessages: ChatMessage[] = [
      {
        id: this.generateMessageId(),
        senderUserId: 'system',
        senderUsername: 'System',
        content: 'Welcome to the support chat! This is a demonstration of real-time messaging between two users.',
        timestamp: new Date().toISOString()
      }
    ];
    
    this.saveMessagesToStorage(defaultMessages);
    this.messagesSubject.next(defaultMessages);
  }

  /**
   * Retrieves messages from localStorage
   */
  private getMessagesFromStorage(): ChatMessage[] {
    const messagesJson = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
    if (messagesJson) {
      try {
        return JSON.parse(messagesJson) as ChatMessage[];
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Saves messages to localStorage
   */
  private saveMessagesToStorage(messages: ChatMessage[]): void {
    localStorage.setItem(this.MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }

  /**
   * Generates a unique message ID using timestamp and random component.
   * Note: For production use, consider using crypto.randomUUID() or a more robust
   * ID generation library to prevent collisions under high concurrency.
   */
  private generateMessageId(): string {
    // Use crypto.randomUUID if available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `msg_${crypto.randomUUID()}`;
    }
    // Fallback for older browsers
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
