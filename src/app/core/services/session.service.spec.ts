import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SessionService } from './session.service';
import { AuthUser } from '../models/auth.models';

const user: AuthUser = {
  id: 1,
  email: 'mario@example.com',
  first_name: 'Mario',
  last_name: 'Rossi',
  phone: null,
  role: 'customer',
  is_active: true,
};

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('non è autenticato di default', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('memorizza la sessione e riconosce l’utente', () => {
    service.setSession('access', 'refresh', user);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.accessToken).toBe('access');
    expect(service.isAdmin()).toBe(false);
  });

  it('logout azzera la sessione', () => {
    service.setSession('access', 'refresh', user);
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.accessToken).toBeNull();
  });
});
