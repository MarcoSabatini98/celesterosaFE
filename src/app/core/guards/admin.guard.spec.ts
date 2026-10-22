import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { adminGuard } from './admin.guard';
import { SessionService } from '../services/session-service/session.service';
import { AuthUser } from '../models/auth.models';

function makeUser(role: 'customer' | 'admin'): AuthUser {
  return {
    id: 1,
    email: 'u@example.com',
    first_name: 'U',
    last_name: 'U',
    phone: null,
    role,
    is_active: true,
  };
}

function runGuard() {
  return TestBed.runInInjectionContext(() =>
    adminGuard({} as ActivatedRouteSnapshot, { url: '/admin' } as RouterStateSnapshot),
  );
}

describe('adminGuard', () => {
  let session: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    session = TestBed.inject(SessionService);
  });

  it('reindirizza se non autenticato', () => {
    expect(runGuard() instanceof UrlTree).toBe(true);
  });

  it('blocca un cliente non admin', () => {
    session.setSession('access', 'refresh', makeUser('customer'));
    expect(runGuard() instanceof UrlTree).toBe(true);
  });

  it('consente un admin', () => {
    session.setSession('access', 'refresh', makeUser('admin'));
    expect(runGuard()).toBe(true);
  });
});
