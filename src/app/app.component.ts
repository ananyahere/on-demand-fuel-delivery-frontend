import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/shared/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'client';
  private isAuthenticated$: Subscription;
  isLoggedIn = true;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated().subscribe(
      state => {
        this.isLoggedIn = state
        console.log(this.isLoggedIn)
      }
    )
  }

  ngOnDestroy(): void {
    this.isAuthenticated$.unsubscribe()
  }

}
