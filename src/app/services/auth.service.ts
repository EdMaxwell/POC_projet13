import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {User} from '../models/chat.model';

/**
 * AuthService manages user authentication and current user state.
 * This is a fake authentication service for PoC purposes - any username/password combination
 * will successfully "log in" a user.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'chat_current_user';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    // Try to restore user from localStorage on service initialization
    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Fake login - accepts any username/password and creates a user.
   * The user ID is generated as a hash of the username for consistency across tabs.
   */
  login(username: string, password: string): boolean {
    if (!username || !username.trim()) {
      return false;
    }

    const user: User = {
      id: this.generateUserId(username.trim()),
      username: username.trim()
    };

    this.setCurrentUser(user);
    return true;
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Returns the current logged-in user (synchronous)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Checks if a user is currently logged in
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Stores the current user in localStorage and updates the subject
   */
  private setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Retrieves user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Generates a consistent user ID based on username.
   * This ensures the same username always gets the same ID.
   */
  private generateUserId(username: string): string {
    // Simple hash function for PoC purposes
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      const char = username.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash | 0; // Convert to 32-bit integer
    }
    return `user_${Math.abs(hash)}`;
  }
}
