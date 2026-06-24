import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

// Protegge il backoffice: solo ruolo admin.
export const adminGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);
  if (session.isAdmin()) return true;
  if (session.isAuthenticated()) return router.createUrlTree(['/']);
  return router.createUrlTree(['/accedi'], { queryParams: { redirect: state.url } });
};
