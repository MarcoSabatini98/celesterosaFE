import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session-service/session.service';
import { environment } from '../../../environments/environment';

// Aggiunge il bearer token JWT e l'header X-Cart-Token (per i guest) alle
// chiamate verso l'API del backend.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBase)) return next(req);

  const session = inject(SessionService);
  const headers: Record<string, string> = {};

  const token = session.accessToken;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const cartToken = session.cartToken;
  if (cartToken) headers['X-Cart-Token'] = cartToken;

  return next(Object.keys(headers).length ? req.clone({ setHeaders: headers }) : req);
};
