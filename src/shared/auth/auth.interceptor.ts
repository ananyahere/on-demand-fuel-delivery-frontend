import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from '../service/localStorage.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(
        private localStorageService: LocalStorageService,
        private router: Router
    ){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req.url)
        if(req.url.includes("https://api.geoapify.com/v1/geocode/reverse")) return next.handle(req);
        if(req.headers.get('No-Auth') === 'True') return next.handle(req);
        const jwtToken: string = this.localStorageService.getItem('userJwt')
        console.log('jwtToken in HttpInterceptor: ', jwtToken)
        const modifiedReq = this.addToken(req, jwtToken);
        return next.handle(modifiedReq).pipe(catchError(
            (err: HttpErrorResponse) => {
                if(err.status == 401){  // Unauthorized
                    this.router.navigate(['/something-wrong'])
                }
                if(err.status ==  403){  // Forbidden
                    this.router.navigate(['/something-wrong'])
                }
                return throwError("Something went wrong")
            }
        ));
    }
    
  private addToken(req: HttpRequest<any>, token: string){
    console.log("addToken in interceptor")
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    })
  }

}