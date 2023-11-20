import { Component, OnInit } from '@angular/core';
import { IconDefinition, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/shared/service/auth.service';
import { Router } from '@angular/router';
import { SignInResponseData } from 'src/shared/model/auth-response-data.model';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { LocationService } from 'src/shared/service/location.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/shared/service/user.service';
import { generateUUID } from 'src/shared/utils/helper';
import { Address } from 'src/shared/model/user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  faArrowLeft: IconDefinition = faArrowLeft;
  catchPhase: string = 'ananya';
  currentStep: number = 1;
  verifyCatchPhaseForm: FormGroup = null;
  signinForm: FormGroup = null;
  isLoading: boolean = false;
  isLocationLoading: boolean = false;
  latitude: number = 0;
  longitude: number = 0;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private localStorageService: LocalStorageService,
    private locationService: LocationService,
    private userService: UserService,
    private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.verifyCatchPhaseForm = new FormGroup({
      catchPhase: new FormControl(null, [Validators.required]),
    });
    this.signinForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  public OnInputCatchPhase(): void {
    const phase = this.verifyCatchPhaseForm.value['catchPhase'];
    this.catchPhase = phase;
    this.setStep(this.currentStep + 1);
  }

  public OnSubmitCredits() {
    if (!this.signinForm.valid) return;
    const email = this.signinForm.value['email'];
    const password = this.signinForm.value['password'];
    this.isLoading = true;
    // user SignIn Service
    this.authService.logIn(email, password).subscribe(
      (userData: SignInResponseData) => {
        // verify catchPhase
        this.authService
          .verifyCatchPhase(email, this.catchPhase)
          .subscribe((isMatch) => {
            if (isMatch) {
              this.isLoading = false;
              this.setStep(this.currentStep + 1);
              console.log('user logged in with correct phase');
            } else {
              this.snackbar.open(`An error occurred. Incorrect catch phase.`, "Dismiss", {
                duration: 3000, // Snackbar duration in milliseconds
                horizontalPosition: 'center', // Position of the snackbar on screen
                verticalPosition: 'bottom' // Position of the snackbar on screen
              })
            }
          });
      },
      (error) => {
        this.snackbar.open(`An error occurred. ${error}. Please try again later.`, "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
        this.isLoading = false;
      }
    );
    this.signinForm.reset();
  }

  OnGoToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  private setStep(step: number) {
    this.currentStep = step;
  }

  public onGetLocation() {
    this.isLocationLoading = true;
    this.locationService.getUserLocation().subscribe(
      position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        // get user location & city
        this.locationService.getCity(this.latitude, this.longitude)
        .subscribe(
        response => {
          // get user city
          let city = response.results[0].city
          let locLine1 = response.results[0].address_line1 
          let locLine2  = response.results[0].address_line2
          if(!city) city = "Hyderabad"
          let location: string = ""
          const userId: string = this.localStorageService.getItem('userId')
          this.userService.setUserLocation(userId, city)
          .subscribe(
          res => {
            console.log(res)
            // store user current address
            const name: string = "Default-User"
            const type: string  = "current"
            if(!locLine1 || !locLine2) location = "789 Oak Lane, Metropolis"
            else location = locLine1 + ", " + locLine2
            this.localStorageService.setItem('userCity', city);
            const address: Address = {
              addressId: 'A'+ generateUUID(),
              receiver: name, 
              type: type, 
              location: location
            }
            this.userService.saveAddress(userId, address).subscribe(
              res => {
                this.snackbar.open(
                  'Address addedd successfully',
                  'Dismiss',
                  {
                    duration: 3000, // Snackbar duration in milliseconds
                    horizontalPosition: 'center', // Position of the snackbar on screen
                    verticalPosition: 'bottom', // Position of the snackbar on screen
                  }
                );
              }, err => {
                this.snackbar.open(
                  'An error occurred while saving address. Please try again later.',
                  'Dismiss',
                  {
                    duration: 3000, // Snackbar duration in milliseconds
                    horizontalPosition: 'center', // Position of the snackbar on screen
                    verticalPosition: 'bottom', // Position of the snackbar on screen
                  }
                );
              }
            )
          },
          err => {
            this.snackbar.open(`An error occurred while saving city Please try again later.`, "Dismiss", {
              duration: 3000, // Snackbar duration in milliseconds
              horizontalPosition: 'center', // Position of the snackbar on screen
              verticalPosition: 'bottom' // Position of the snackbar on screen
            })    
          })
        },
        err => {
          this.snackbar.open(`An error occurred while getting user city. Please try again later.`, "Dismiss", {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom' // Position of the snackbar on screen
          })
        }
        )
      },
      err => {
        this.snackbar.open(`An error occurred while gwtting user location. Please try again later.`, "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
      }
    )
  }

  public toHome(){
    this.router.navigate(['/'])
  }
}

