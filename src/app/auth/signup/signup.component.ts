import { Component, OnInit } from '@angular/core';
import { IconDefinition, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/shared/service/auth.service';
import { Router } from '@angular/router';
import { SignUpResponseData } from 'src/shared/model/auth-response-data.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  faArrowLeft: IconDefinition = faArrowLeft;
  catchPhase: string = '';
  signupForm: FormGroup = null;
  setupCatchPhaseForm: FormGroup = null;
  currentStep: number = 1;
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.setupCatchPhaseForm = new FormGroup({
      catchPhase: new FormControl(null, [Validators.required]),
    });
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  public OnSetCatchPhase(): void {
    this.catchPhase = this.setupCatchPhaseForm.value['catchPhase'];
    console.log('catchPhase: ', this.catchPhase);
    this.setStep(this.currentStep + 1);
  }

  public OnSubmitCredits() {
    console.log(this.signupForm.value);
    console.log(this.catchPhase);
    if (!this.signupForm.valid) return;
    const email = this.signupForm.value['email'];
    const password = this.signupForm.value['password'];
    this.isLoading = true;
    // User SignUp Service
    this.authService.signUp(email, password, this.catchPhase).subscribe(
      (userData: SignUpResponseData) => {
        this.isLoading = false;
        this.setStep(this.currentStep + 1);
        console.log('user signed up!');
      },
      (error) => {
        // ..
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
}
