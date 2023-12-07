import { Router } from '@angular/router'
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service'

/**
 * @description Lets only logged in users to access route
 * @returns True if user is logged in, else false
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  let isLoggedIn = false;
  inject(AuthService).isAuthenticated$.subscribe((state: boolean) => {
    isLoggedIn = state;
  });
  if (isLoggedIn){
    return true
  } 
  else {
    inject(Router).navigate(['/']);
  }
  return false;
};
