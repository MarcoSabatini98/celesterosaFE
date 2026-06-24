import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session-service/session.service';

// Protegge le rotte riservate ai clienti autenticati.
export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);
  if (session.isAuthenticated()) return true;
  return router.createUrlTree(['/accedi'], { queryParams: { redirect: state.url } });
};
