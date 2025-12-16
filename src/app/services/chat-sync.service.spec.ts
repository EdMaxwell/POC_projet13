import { TestBed } from '@angular/core/testing';
import { ChatSyncService } from './chat-sync.service';
import { ChatMessage } from '../models/chat.models';

describe('ChatSyncService', () => {
  let service: ChatSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSyncService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty messages', () => {
    const messages = service.getMessages();
    expect(messages).toEqual([]);
  });

  it('should send a message and add it to the list', () => {
    const message = service.sendMessage('user_123', 'alice', 'Hello world!');
    
    expect(message).toBeTruthy();
    expect(message.senderUserId).toBe('user_123');
    expect(message.senderUsername).toBe('alice');
    expect(message.content).toBe('Hello world!');
    
    const messages = service.getMessages();
    expect(messages.length).toBe(1);
    expect(messages[0]).toEqual(message);
  });

  it('should persist messages in localStorage', () => {
    service.sendMessage('user_123', 'alice', 'Test message');
    
    // Create a new service instance to simulate page reload
    const newService = new ChatSyncService();
    
    const messages = newService.getMessages();
    expect(messages.length).toBe(1);
    expect(messages[0].content).toBe('Test message');
  });

  it('should emit messages$ observable when message is sent', (done) => {
    let emissionCount = 0;
    
    service.messages$.subscribe((messages: ChatMessage[]) => {
      emissionCount++;
      if (emissionCount === 2) { // Skip initial emission
        expect(messages.length).toBe(1);
        expect(messages[0].content).toBe('New message');
        done();
      }
    });
    
    service.sendMessage('user_123', 'alice', 'New message');
  });

  it('should clear all messages', () => {
    service.sendMessage('user_123', 'alice', 'Message 1');
    service.sendMessage('user_456', 'bob', 'Message 2');
    
    expect(service.getMessages().length).toBe(2);
    
    service.clearMessages();
    
    expect(service.getMessages().length).toBe(0);
  });

  it('should initialize with default messages', () => {
    service.initializeWithDefaultMessages();
    
    const messages = service.getMessages();
    expect(messages.length).toBe(1);
    expect(messages[0].senderUsername).toBe('System');
    expect(messages[0].content).toContain('Welcome to the support chat');
  });

  it('should generate unique message IDs', () => {
    const message1 = service.sendMessage('user_123', 'alice', 'Message 1');
    const message2 = service.sendMessage('user_123', 'alice', 'Message 2');
    
    expect(message1.id).not.toBe(message2.id);
  });

  it('should maintain message order', () => {
    service.sendMessage('user_123', 'alice', 'First');
    service.sendMessage('user_456', 'bob', 'Second');
    service.sendMessage('user_123', 'alice', 'Third');
    
    const messages = service.getMessages();
    expect(messages.length).toBe(3);
    expect(messages[0].content).toBe('First');
    expect(messages[1].content).toBe('Second');
    expect(messages[2].content).toBe('Third');
  });
});
