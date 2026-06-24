import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { authGuard } from './auth.guard';
import { SessionService } from '../services/session-service/session.service';
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

function runGuard() {
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, { url: '/ordini' } as RouterStateSnapshot),
  );
}

describe('authGuard', () => {
  let session: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    session = TestBed.inject(SessionService);
  });

  it('reindirizza al login se non autenticato', () => {
    expect(runGuard() instanceof UrlTree).toBe(true);
  });

  it('consente l’accesso se autenticato', () => {
    session.setSession('access', 'refresh', user);
    expect(runGuard()).toBe(true);
  });
});
