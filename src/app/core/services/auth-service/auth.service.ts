import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../models/common.models';
import { AuthResult, AuthUser, LoginPayload, RegisterPayload } from '../../models/auth.models';
import { SessionService } from '../session-service/session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private session = inject(SessionService);
  private base = `${environment.apiBase}/auth`;

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

  logout(): void {
    this.session.logout();
  }
}
