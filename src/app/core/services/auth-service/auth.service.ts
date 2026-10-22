import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/common.models';
import { AuthResult, AuthUser, LoginPayload, RegisterPayload } from '../../models/auth.models';
import { SessionService } from '../session-service/session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private session = inject(SessionService);
  private base = `${environment.apiBase}/auth`;

  // Refresh in corso condiviso: evita richieste multiple in parallelo quando più
  // chiamate ricevono 401 contemporaneamente.
  private refresh$?: Observable<string>;

  register(payload: RegisterPayload): Observable<AuthResult> {
    return this.http.post<ApiResponse<AuthResult>>(`${this.base}/register`, payload).pipe(
      map((r) => r.data),
      tap((res) => this.session.setSession(res.access_token, res.refresh_token, res.user)),
    );
  }

  login(payload: LoginPayload): Observable<AuthResult> {
    return this.http.post<ApiResponse<AuthResult>>(`${this.base}/login`, payload).pipe(
      map((r) => r.data),
      tap((res) => this.session.setSession(res.access_token, res.refresh_token, res.user)),
    );
  }

  me(): Observable<AuthUser> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.base}/me`).pipe(map((r) => r.data));
  }

  // Ruota il refresh token e aggiorna la sessione. Restituisce il nuovo access
  // token. Condivide la richiesta in volo tra chiamanti concorrenti.
  refresh(): Observable<string> {
    if (!this.refresh$) {
      const token = this.session.refreshToken;
      if (!token) return throwError(() => new Error('Nessun refresh token disponibile'));

      this.refresh$ = this.http
        .post<ApiResponse<AuthResult>>(`${this.base}/refresh`, { refresh_token: token })
        .pipe(
          map((r) => r.data),
          tap((res) => this.session.setSession(res.access_token, res.refresh_token, res.user)),
          map((res) => res.access_token),
          shareReplay(1),
          finalize(() => (this.refresh$ = undefined)),
        );
    }
    return this.refresh$;
  }

  // Revoca il refresh token lato server (best-effort) e azzera la sessione.
  logout(): void {
    const token = this.session.refreshToken;
    if (token) {
      this.http
        .post(`${this.base}/logout`, { refresh_token: token })
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
    this.session.logout();
  }
}
