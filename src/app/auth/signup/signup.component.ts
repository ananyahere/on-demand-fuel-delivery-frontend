import { Component, OnInit } from '@angular/core';
import { IconDefinition, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/shared/service/auth.service';
import { Router } from '@angular/router';
import { SignUpResponseData } from 'src/shared/model/auth-response-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import emailjs from '@emailjs/browser';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  faArrowLeft: IconDefinition = faArrowLeft;
  catchPhase: string = '';
  oneTimeCatchPhase: string = '';
  signupForm: FormGroup = null;
  setupCatchPhaseForm: FormGroup = null;
  currentStep: number = 1;
  isLoading: boolean = false;
  isOTPSent: boolean = false;

  constructor(private authService: AuthService, 
              private router: Router, 
              private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.setupCatchPhaseForm = new FormGroup({
      catchPhase: new FormControl(null, [Validators.required]),
    });
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Sets the current catch phase and updates the current step.
   */
  public OnSetCatchPhase(): void {
    this.catchPhase = this.setupCatchPhaseForm.value['catchPhase'];
    this.setStep(this.currentStep + 1);
  }

  /**
    * Handles form submission for the Sign Up component.
    * Logs the current form values and catch phase to the console for debugging purposes.
    * Checks if the form is valid. If it is not, returns false.
    * Retrieves the email and password form values from the signupForm FormGroup.
    * Sets isLoading to true, indicating that a network request is in progress.
    * Calls the authService.signUp() method, passing in the email, password, and catch phase values.
    * If successful, sets isLoading to false and advances the current step by one.
    * If an error occurs, sets isLoading to false.
    * Resets the signupForm FormGroup.
   * @returns void
   */
  public OnSubmitCredits() {
    if (!this.signupForm.valid) return;
    const email = this.signupForm.value['email'];
    const password = this.signupForm.value['password'];
    this.isLoading = true;
    // User SignUp Service
    this.authService.signUp(email, password, "test-catch-phase").subscribe(
      (userData: SignUpResponseData) => {
        this.isLoading = false;
        this.setStep(this.currentStep + 1);
      },
      (error) => {
        this.snackbar.open("An error occurred. Please try again later.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
        this.isLoading = false;
      }
    );
    this.signupForm.reset();
  }

  private setStep(step: number) {
    this.currentStep = step;
  }

  OnGoToSignIn() {
    this.router.navigate(['/signin']);
  }

  toHome() {
    this.router.navigate(['/'])
  }

  generateOneTimeCatchPhase(): string{
    const otp = Math.floor(1000 + Math.random() * 9000);
    this.oneTimeCatchPhase = otp.toString();
    return otp.toString()
  }

  verifyOneTimeCatchPhase(): void{
    if(!this.setupCatchPhaseForm.valid){
      this.snackbar.open("Please enter Catch Phase.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
      return
    }
    const userInputCatchPhase = this.setupCatchPhaseForm.value['catchPhase'];
    if(userInputCatchPhase.toString() == this.oneTimeCatchPhase){
      console.log("correct catch phase")
      this.setStep(this.currentStep + 1);
    } 

  }

  OnSendCatchPhase(){
    const catchPhase = this.generateOneTimeCatchPhase()
    console.log("generated catch phase: ", catchPhase)
    emailjs.send("service_oobe4i4","template_fg1qwvv", {
      "message": catchPhase
    }, "s8px8g5kv_n6wsVF0")
    .then((result) => {
      console.log(result)
      this.isOTPSent = true;
      this.snackbar.open("Catch Phase send successfully! Please check your email.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
    }),
    (err) => {
      console.log(err)
      this.snackbar.open("An error occurred while sending catch-phase. Please try again later.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
    }
  }

}
