import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { of, lastValueFrom } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { SessionService } from '../services/session-service/session.service';
import { environment } from '../../../environments/environment';
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

// Esegue l'interceptor catturando la richiesta passata a next.
async function intercept(url: string): Promise<HttpRequest<unknown>> {
  let captured!: HttpRequest<unknown>;
  const next: HttpHandlerFn = (req) => {
    captured = req;
    return of(new HttpResponse({ status: 200 }));
  };
  await lastValueFrom(
    TestBed.runInInjectionContext(() => authInterceptor(new HttpRequest('GET', url), next)),
  );
  return captured;
}

describe('authInterceptor', () => {
  let session: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    session = TestBed.inject(SessionService);
  });

  it('non tocca le richieste verso origini esterne', async () => {
    session.setSession('tok', 'ref', user);
    const req = await intercept('https://altro-dominio.test/x');
    expect(req.headers.has('Authorization')).toBe(false);
  });

  it('aggiunge il bearer token alle chiamate API', async () => {
    session.setSession('tok', 'ref', user);
    const req = await intercept(`${environment.apiBase}/auth/me`);
    expect(req.headers.get('Authorization')).toBe('Bearer tok');
  });

  it('aggiunge X-Cart-Token se presente', async () => {
    session.setCartToken('cart-123');
    const req = await intercept(`${environment.apiBase}/cart`);
    expect(req.headers.get('X-Cart-Token')).toBe('cart-123');
    expect(req.headers.has('Authorization')).toBe(false);
  });
});
