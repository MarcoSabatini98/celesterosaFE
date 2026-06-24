import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { SessionService } from '../services/session-service/session.service';
import { AuthService } from '../services/auth-service/auth.service';
import { environment } from '../../../environments/environment';

// Aggiunge il bearer token JWT e l'header X-Cart-Token (per i guest) alle
// chiamate verso l'API. Su risposta 401 tenta una volta il refresh del token e
// ripete la richiesta; se il refresh fallisce, esegue il logout e reindirizza
// al login.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBase)) return next(req);

  const session = inject(SessionService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthCall = req.url.includes('/auth/');

  return next(withHeaders(req, session.accessToken, session.cartToken)).pipe(
    catchError((err) => {
      // Solo i 401 su chiamate non-auth, e solo se abbiamo un refresh token.
      if (err.status !== 401 || isAuthCall || !session.refreshToken) {
        return throwError(() => err);
      }
      return auth.refresh().pipe(
        switchMap((token) => next(withHeaders(req, token, session.cartToken))),
        catchError((refreshErr) => {
          auth.logout();
          router.navigate(['/accedi']);
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};

// Clona la richiesta aggiungendo gli header di autenticazione disponibili.
function withHeaders(
  req: HttpRequest<unknown>,
  accessToken: string | null,
  cartToken: string | null,
): HttpRequest<unknown> {
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (cartToken) headers['X-Cart-Token'] = cartToken;
  return Object.keys(headers).length ? req.clone({ setHeaders: headers }) : req;
}
