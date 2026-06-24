import { Injectable, computed, signal } from '@angular/core';
import { AuthUser } from '../models/auth.models';

const ACCESS = 'celesterosa-access';
const REFRESH = 'celesterosa-refresh';
const USER = 'celesterosa-user';
const CART_TOKEN = 'celesterosa-cart';

// Stato di sessione: token JWT, utente corrente e token carrello guest.
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly user = signal<AuthUser | null>(this.readUser());
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  get accessToken(): string | null {
    return localStorage.getItem(ACCESS);
  }
  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH);
  }
  get cartToken(): string | null {
    return localStorage.getItem(CART_TOKEN);
  }

  setSession(accessToken: string, refreshToken: string, user: AuthUser): void {
    localStorage.setItem(ACCESS, accessToken);
    localStorage.setItem(REFRESH, refreshToken);
    localStorage.setItem(USER, JSON.stringify(user));
    this.user.set(user);
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem(ACCESS, accessToken);
  }

  setCartToken(token: string | null): void {
    if (token) localStorage.setItem(CART_TOKEN, token);
  }

  clearCartToken(): void {
    localStorage.removeItem(CART_TOKEN);
  }

  logout(): void {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER);
    this.user.set(null);
  }

  private readUser(): AuthUser | null {
    const raw = localStorage.getItem(USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
