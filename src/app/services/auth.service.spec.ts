import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {User} from '../models/chat.model';


describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with any username/password', () => {
    const result = service.login('testuser', 'anypassword');

    expect(result).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();

    const currentUser = service.getCurrentUser();
    expect(currentUser).toBeTruthy();
    expect(currentUser?.username).toBe('testuser');
  });

  it('should not login with empty username', () => {
    const result = service.login('', 'password');

    expect(result).toBeFalse();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should logout successfully', () => {
    service.login('testuser', 'password');
    expect(service.isLoggedIn()).toBeTrue();

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should generate consistent user IDs for same username', () => {
    service.login('alice', 'password1');
    const user1 = service.getCurrentUser();

    service.logout();

    service.login('alice', 'password2');
    const user2 = service.getCurrentUser();

    expect(user1?.id).toBe(user2?.id);
  });

  it('should persist user in localStorage', () => {
    service.login('testuser', 'password');

    // Create a new service instance to simulate page reload
    const newService = new AuthService();

    expect(newService.isLoggedIn()).toBeTrue();
    expect(newService.getCurrentUser()?.username).toBe('testuser');
  });

  it('should emit currentUser$ observable on login', (done) => {
    service.currentUser$.subscribe((user: User | null) => {
      if (user) {
        expect(user.username).toBe('testuser');
        done();
      }
    });

    service.login('testuser', 'password');
  });

  it('should trim whitespace from username', () => {
    service.login('  testuser  ', 'password');

    const user = service.getCurrentUser();
    expect(user?.username).toBe('testuser');
  });
});
