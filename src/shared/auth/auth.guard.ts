import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { AuthService } from '../service/auth.service'

export class AuthGuard implements CanActivate{
    constructor(
        private authService: AuthService,
        private router: Router
    ){}
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.authService.isAuthenticatedSubject.pipe(map(state => {
            return state
        }),
        tap(isAuth => {
            console.log("isAuthenticated: ", isAuth)
            if(!isAuth) this.router.navigate(['/signup'])
        })
        );
    }
}