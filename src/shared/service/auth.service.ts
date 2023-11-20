import { HttpClient } from '@angular/common/http';
import { throwError, BehaviorSubject, from, of, Observable } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { UserAuth } from '../model/user-auth.model';
import { Router } from '@angular/router';
import {
  SignInResponseData,
  SignUpResponseData,
} from '../model/auth-response-data.model';
import { LocalStorageService } from './localStorage.service';
import { UserMongoAuth } from '../model/user-mongo-auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth } from "firebase/auth";

@Injectable()
export class AuthService {
  isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private tokenExiprationTimer: any;
  catchPhase: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    public afAuth: AngularFireAuth // Inject Firebase auth service
  ) {
    // check if there is saved token
    console.log("jwt auth service",this.localStorageService.getItem('userJwt'))
    if(this.localStorageService.getItem('userJwt')){
      this.isAuthenticatedSubject.next(true);
    }
  }

  public isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('userData');
    if (this.tokenExiprationTimer) {
      clearTimeout(this.tokenExiprationTimer);
    }
    this.tokenExiprationTimer = null;
    this.isAuthenticatedSubject.next(false);
  }

  autoLogin() {
    const userDataJSON = localStorage.getItem('userData');
    if (!userDataJSON) return;
    const userData = JSON.parse(userDataJSON);
    const loadedUser = new UserAuth(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      // this.userAuthChanges.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date(new Date()).getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExiprationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private storeUserInfo(username: string, userId: string, userRole: string) {
    this.localStorageService.setItem('username', username);
    this.localStorageService.setItem('userId', userId);
    this.localStorageService.setItem('userRole', userRole);
  }

  private storeUserJwt(token: string) {
    this.localStorageService.setItem('userJwt', token);
  }

  public signUp(email: string, password: string, catchPhase: string) {
    return from(
      this.afAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      switchMap((credentials) => {
        return this.http.post<SignUpResponseData>(
          'http://localhost:8080/register',
          {
            userEmail: email,
            userPassword: password,
            username: email,
            catchPhase: catchPhase,
          },
          {
            headers: {
              'No-Auth': 'True',
            },
          }
        );
      }),
      tap((resData: SignUpResponseData) => {
        this.storeUserInfo(
          resData.username,
          resData.userId,
          resData.role[0].roleName
        );
      }),
      catchError((error) => this.handleFirebaseError(error.code))
    );
  }

  private handleFirebaseError(e: string) {
    let errorMessage = 'An unknown error occured!';
    switch (e) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email exist already';
        break;
      case 'auth/invalid-email':
        errorMessage = "This email doesn't exist";
        break;
      case 'auth/wrong-password':
        errorMessage = 'This password is incorrect';
        break;
    }
    return throwError(errorMessage);
  }

  public logIn(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((credentials) => {
        return this.http.post<SignInResponseData>(
          'http://localhost:8080/authenticate',
          {
            userName: email,
            userPassword: password,
          },
          {
            headers: {
              'No-Auth': 'True',
            },
          }
        );
      }),
      tap((resData: SignInResponseData) => {
        this.isAuthenticatedSubject.next(true);
        this.storeUserJwt(resData.jwtToken);
        this.storeUserInfo(
          resData.userAuth.username,
          resData.userAuth.userId,
          resData.userAuth.role[0].roleName
        );
      }),
      catchError((error) => this.handleFirebaseError(error.code))
    );
  }

  public logOut() {
    this.localStorageService.removeItem('username');
    this.localStorageService.removeItem('userId');
    this.localStorageService.removeItem('userRole');
    this.localStorageService.removeItem('userJwt');
    this.isAuthenticatedSubject.next(false);
  }


  public verifyCatchPhase(username: string, phase: string) {
    return this.http
    .get<any>(`http://localhost:8080/catchphase?email=${username}`, {
      headers: {
        'No-Auth': 'True',
      },
    })
    .pipe(
      map(response => {
        return response.catchPhase === phase
      }),
      catchError(err =>{
        return of(false)
      })
    )
  }

  public loginWithMobilew(phone: string, appVerifier){
    return from(
      this.afAuth.signInWithPhoneNumber(phone, appVerifier)).pipe(
        switchMap(res => {
          return this.http.post<SignInResponseData>(
            'http://localhost:8080/authenticate', {
              userName: 'johndoe@example.com',
              userPassword: 'johndoe@example.com'
            },{
              headers: {
                'No-Auth': 'True'
              }
            }
          )
        }),
        tap((resData: SignInResponseData) => {
          this.isAuthenticatedSubject.next(true);
          this.storeUserJwt(resData.jwtToken);
          this.storeUserInfo(
            resData.userAuth.username,
            resData.userAuth.userId,
            resData.userAuth.role[0].roleName
          );
        }),
        catchError(err => this.handleFirebaseError(err.code))
      )
  }

  public loginWithMobile(){
    return this.http.post<SignInResponseData>(
      'http://localhost:8080/authenticate', {
        userName: 'johndoe@example.com',
        userPassword: 'johndoe@example.com'
      }, {
        headers: {
          'No-Auth': 'True'
        }
      }
    ).pipe(
      tap((resData: SignInResponseData) => {
        this.isAuthenticatedSubject.next(true);
        this.storeUserJwt(resData.jwtToken);
        this.storeUserInfo(
          resData.userAuth.username,
          resData.userAuth.userId,
          resData.userAuth.role[0].roleName
        );
      })
    )
  }
}
  


// signup(email: string, password: string) {
//   console.log('In AuthService.signup');
//   return this.http
//     .post<AuthResponseData>(
//       'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCeDHrtOE3IryPqbQZsi6KYNMJK0p6D8yE',
//       {
//         email: email,
//         password: password,
//         requestToken: true,
//         returnSecureToken: true,
//       },
//       {
//         headers: {
//           'No-Auth': 'True',
//         },
//       }
//     )
//     .pipe(
//       catchError(this.handleErrorResponse),
//       tap((resData) => {
//         console.log('response from firebase api');
//         console.log(resData);
//         this.handleAuth(
//           resData.email,
//           resData.localId,
//           resData.idToken,
//           Number(resData.expiresIn)
//         );
//       }),
//       switchMap((authData) => {
//         console.log('call to localhost');
//         // set email as username
//         const username = email;
//         // Make a call to the BASE_URL/register endpoint
//         return this.http.post(
//           'http://localhost:8080/register',
//           {
//             userEmail: email,
//             userPassword: password,
//             username: username,
//           },
//           {
//             headers: { 'No-Auth': 'True' },
//           }
//         );
//       }),
//       tap((resData: any) => {
//         console.log(resData);
//         this.storeUserInfo(
//           resData.username,
//           resData.userId,
//           resData.role.roleName
//         );
//       })
//     );
// }

// login(email: string, password: string) {
//   console.log('In AuthService.login');
//   console.log('call to firebase');
//   return this.http
//     .post<AuthResponseData>(
//       'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCeDHrtOE3IryPqbQZsi6KYNMJK0p6D8yE',
//       {
//         email: email,
//         password: password,
//         requestToken: true,

//         // returnSecureToken: true,
//       },
//       {
//         headers: { 'No-Auth': 'True' },
//       }
//     )
//     .pipe(
//       catchError(this.handleErrorResponse),
//       tap((resData) => {
//         console.log(resData);
//         this.handleAuth(
//           resData.email,
//           resData.localId,
//           resData.idToken,
//           Number(resData.expiresIn)
//         );
//       }),
//       switchMap((authData) => {
//         console.log('call to localhost');
//         return this.http.post(
//           'http://localhost:8080/authenticate',
//           {
//             userName: email,
//             userPassword: password,
//           },
//           {
//             headers: { 'No-Auth': 'True' },
//           }
//         );
//       }),
//       tap((resData: any) => {
//         console.log(resData);
//         this.storeUserJwt(resData.jwtToken);
//         this.storeUserInfo(
//           resData.userAuth.username,
//           resData.userAuth.userId,
//           resData.userAuth.role.roleName
//         );
//         const userMongoAuth = new UserMongoAuth(
//           resData.userAuth.username,
//           resData.userAuth.userId,
//           resData.userAuth.role[0].roleName,
//           resData.jwtToken
//         );
//         this.userMongoAuthChanges.next(userMongoAuth); // emit new logged-in user
//       })
//     );
// }

// private handleErrorResponse(errorRes: HttpErrorResponse) {
//   console.log(errorRes);
//   let errorMessage = 'An unknown error occured!';
//   if (!errorRes.error || !errorRes.error.error) {
//     return throwError(errorMessage);
//   }
//   switch (errorRes.error.error.message) {
//     case 'EMAIL_EXIST':
//       errorMessage = 'This email exist already';
//       break;
//     case 'EMAIL_NOT_FOUND':
//       errorMessage = "This email doesn't exist";
//       break;
//     case 'INVALID_PASSWORD':
//       errorMessage = 'This password is incorrect';
//       break;
//   }
//   return throwError(errorMessage);
// }

// private handleAuth(
//   email: string,
//   id: string,
//   token: string,
//   expiresIn: number
// ) {
//   const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
//   const newUser = new UserAuth(email, id, token, expirationDate);
//   this.userAuthChanges.next(newUser); // emit new user/logged-in user
//   this.autoLogout(expiresIn * 1000);
//   this.localStorageService.setItem('userData', newUser);
//   // localStorage.setItem('userData', JSON.stringify(newUser));
// }

  // setCatchPhase(email: string, uuid: string, phase: string) {
  //   return this.http
  //     .post<any>(
  //       'https://angular-phone-number-auth-default-rtdb.firebaseio.com/users.json',
  //       {
  //         email: email,
  //         uuid: uuid,
  //         catchPhase: phase,
  //       }
  //     )
  //     .pipe(tap((userData) => console.log('setCatchPhase:', userData)));
  // }

  // getCatchPhase(uuid: string) {
  //   return this.http
  //     .get<any>(
  //       `https://angular-phone-number-auth-default-rtdb.firebaseio.com/users.json?orderBy="uuid"&equalTo="${uuid}"`
  //     )
  //     .pipe(tap((userData) => console.log('getCatchPhase', userData)));
  // }

      // return this.afAuth
    //   .createUserWithEmailAndPassword(email, password)
    //   .then((credentials) => {
    //     console.log('Succesfully created user in Firebase: ', credentials.user);
    //     return this.http
    //     .post<SignUpResponseData>('', {
    //       userEmail: email,
    //       userPassword: password,
    //       username: email,
    //       catchPhase: catchPhase
    //     })
    //     .pipe(
    //       // catchError((error) => this.handleFirebaseError(error.code)),
    //       tap((resData: SignUpResponseData) => {
    //         this.storeUserInfo(
    //           resData.username,
    //           resData.userId,
    //           resData.role[0].roleName
    //         );
    //       })
    //     );
    //   })
    //   .catch((error) => {
    //     this.handleFirebaseError(error.code);
    //   });

