import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IconDefinition, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { WindowService } from 'src/shared/service/window.service';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/shared/service/auth.service';
import { SignInResponseData } from 'src/shared/model/auth-response-data.model';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { LocationService } from 'src/shared/service/location.service';
import { generateUUID } from 'src/shared/utils/helper';
import { Address } from 'src/shared/model/user.model';
import { UserService } from 'src/shared/service/user.service';


@Component({
  selector: 'app-signin-mobile',
  templateUrl: './signin-mobile.component.html',
  styleUrls: ['./signin-mobile.component.css']
})
export class SigninMobileComponent implements OnInit{
  faArrowLeft: IconDefinition = faArrowLeft;
  currentStep: number = 1;
  signinPhoneForm: FormGroup = null;
  verifyCodeForm: FormGroup = null;
  winRef: any;
  auth: any;
  isLoading: boolean = false;
  isLocationLoading: boolean = false;
  latitude: number = 0;
  longitude: number = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private locationService: LocationService,
    private windowSerice: WindowService,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private renderer: Renderer2, 
    private el: ElementRef){}

  private setStep(step: number) {
    this.currentStep = step;
  }

  ngOnInit(): void {
    this.signinPhoneForm = new FormGroup({
      'phone': new FormControl(null, [
        Validators.required,
        Validators.minLength(10)])
    })
    this.verifyCodeForm = new FormGroup({
      'code': new FormControl(null, [Validators.required])
    })
    this.winRef = this.windowSerice.windowRef
    this.auth = getAuth()
    this.winRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, this.auth);
    this.winRef.recaptchaVerifier.render()
  }

  public onSubmitCredits(){
    console.log(this.signinPhoneForm.value)
    if(!this.signinPhoneForm.valid){
      this.snackbar.open("Please check the form and make sure all required fields are filled out correctly.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
    }else{
      const appVerifier = this.winRef.recaptchaVerifier
      let num = '+91'+this.signinPhoneForm.value["phone"]
      this.isLoading = true;
      signInWithPhoneNumber(this.auth, num, appVerifier)
      .then(result => {
        this.winRef.confirmationResult = result
        this.authService.loginWithMobile().subscribe(
          (userData: SignInResponseData) => {
            this.isLoading = false;
            const elem = this.el.nativeElement.querySelector("#recaptcha-container")
            this.renderer.setStyle(elem, 'display', 'none');
            this.setStep(this.currentStep+1)
          }
        )
        this.setStep(this.currentStep+1)
        const elem = this.el.nativeElement.querySelector("#recaptcha-container")
        this.renderer.setStyle(elem, 'display', 'none');
      })
      .catch(e => {
        this.snackbar.open("An error occurred. Please try again later.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
      })



      // this.authService.loginWithMobile(num, appVerifier)
      // .subscribe(
      //   (userData: SignInResponseData) => {
          
      //     this.isLoading = false;
      //     const elem = this.el.nativeElement.querySelector("#recaptcha-container")
      //     this.renderer.setStyle(elem, 'display', 'none');
      //     this.setStep(this.currentStep+1)
      //   }, 
      //   err => {
      //   console.log(err)
      //   this.snackbar.open(`An error occurred. ${err}. Please try again later.`, "Dismiss", {
      //     duration: 3000, // Snackbar duration in milliseconds
      //     horizontalPosition: 'center', // Position of the snackbar on screen
      //     verticalPosition: 'bottom' // Position of the snackbar on screen
      //   })
      //   }
      // )
    }
  }

  public onVerifyCode(){
    if(!this.verifyCodeForm.valid){
      this.snackbar.open("Please check the form and make sure all required fields are filled out correctly.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
    }else{
      this.winRef.confirmationResult
      .confirm(this.verifyCodeForm.value["code"])
      .then(result => {
        this.snackbar.open("Correct verification code", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
        console.log(result.user)
        this.setStep(this.currentStep+1)
      })
      .catch(e => {
        this.snackbar.open("An error occurred. Please try again later.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
      })
    }
  }

  public onGoToDashboard() {
    this.router.navigate(['/dashboard']);
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

  OnGoToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
