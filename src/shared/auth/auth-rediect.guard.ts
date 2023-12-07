import { Router } from '@angular/router'
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service'

export const AuthRedirectGuard:  CanActivateFn = (route, state) => {
    let isLoggedIn = false;
    inject(AuthService).isAuthenticated$.subscribe((state: boolean) => {
      isLoggedIn = state;
    });
    if(isLoggedIn){
        inject(Router).navigate(['/dashboard']); // If loggedIn, redirect user to dashboard
    }else{
        return true; // allow them to visit the homepage
    }
    return true;
}