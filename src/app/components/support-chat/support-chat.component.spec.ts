import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SupportChatComponent } from './support-chat.component';
import { AuthService } from '../../services/auth.service';
import { ChatSyncService } from '../../services/chat-sync.service';
import { BehaviorSubject } from 'rxjs';
import { User, ChatMessage } from '../../models/chat.models';

describe('SupportChatComponent', () => {
  let component: SupportChatComponent;
  let fixture: ComponentFixture<SupportChatComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let chatSyncService: jasmine.SpyObj<ChatSyncService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 'user_123',
    username: 'testuser'
  };

  const mockMessages: ChatMessage[] = [
    {
      id: 'msg_1',
      senderUserId: 'user_123',
      senderUsername: 'testuser',
      content: 'Hello!',
      timestamp: '2024-12-10T10:30:00Z'
    },
    {
      id: 'msg_2',
      senderUserId: 'user_456',
      senderUsername: 'otheruser',
      content: 'Hi there!',
      timestamp: '2024-12-10T11:00:00Z'
    }
  ];

  beforeEach(async () => {
    const messagesSubject = new BehaviorSubject<ChatMessage[]>(mockMessages);

    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'logout',
      'isLoggedIn'
    ]);
    const chatSyncServiceSpy = jasmine.createSpyObj('ChatSyncService', [
      'sendMessage',
      'getMessages',
      'initializeWithDefaultMessages'
    ], {
      messages$: messagesSubject.asObservable()
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.isLoggedIn.and.returnValue(true);
    chatSyncServiceSpy.getMessages.and.returnValue(mockMessages);

    await TestBed.configureTestingModule({
      imports: [SupportChatComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ChatSyncService, useValue: chatSyncServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    chatSyncService = TestBed.inject(ChatSyncService) as jasmine.SpyObj<ChatSyncService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture = TestBed.createComponent(SupportChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should redirect to login if not authenticated', () => {
    authService.getCurrentUser.and.returnValue(null);
    
    component.ngOnInit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display messages from chat sync service', () => {
    expect(component.messages.length).toBe(2);
    expect(component.messages[0].content).toBe('Hello!');
    expect(component.messages[1].content).toBe('Hi there!');
  });

  it('should display logged-in username', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logged-in-user')?.textContent).toContain('testuser');
  });

  it('should display reservation details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.vehicle')?.textContent).toContain('Peugeot 208 - Compact');
  });

  it('should send a new message when sendMessage is called', () => {
    const newMessage: ChatMessage = {
      id: 'msg_3',
      senderUserId: 'user_123',
      senderUsername: 'testuser',
      content: 'New test message',
      timestamp: new Date().toISOString()
    };

    chatSyncService.sendMessage.and.returnValue(newMessage);

    component.newMessageText = 'New test message';
    component.sendMessage();

    expect(chatSyncService.sendMessage).toHaveBeenCalledWith(
      'user_123',
      'testuser',
      'New test message'
    );
    expect(component.newMessageText).toBe('');
  });

  it('should not send empty messages', () => {
    component.newMessageText = '   ';
    component.sendMessage();

    expect(chatSyncService.sendMessage).not.toHaveBeenCalled();
  });

  it('should identify own messages correctly', () => {
    const ownMessage = mockMessages[0];
    const otherMessage = mockMessages[1];

    expect(component.isOwnMessage(ownMessage)).toBeTrue();
    expect(component.isOwnMessage(otherMessage)).toBeFalse();
  });

  it('should format datetime correctly', () => {
    const formattedDate = component.formatDateTime('2024-12-10T10:30:00Z');
    expect(formattedDate).toContain('10');
    expect(formattedDate).toContain('Dec');
    expect(formattedDate).toContain('2024');
  });

  it('should logout and redirect to login', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display messages with correct styling for own and other messages', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const messages = compiled.querySelectorAll('.message');
    
    expect(messages.length).toBe(2);
    expect(messages[0].classList.contains('own-message')).toBeTrue();
    expect(messages[1].classList.contains('other-message')).toBeTrue();
  });
});
