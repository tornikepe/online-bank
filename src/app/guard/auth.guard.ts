import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../interceptors/auth.service';

/**
 * Blocks the signed-in area for visitors without a token and remembers where they
 * were headed so sign-in can send them back there.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isSignedIn()) {
    return true;
  }

  return router.createUrlTree(['/sign-in'], {
    queryParams: { returnUrl: state.url },
  });
};

/**
 * Keeps an already signed-in user out of the sign-in / sign-up screens.
 */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isSignedIn() ? router.createUrlTree(['/dashboard']) : true;
};
