import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showDropdown: boolean = false
  faAngleDown: IconDefinition = faAngleDown;
  faAngleUp: IconDefinition = faAngleUp;

  constructor(private router: Router) {}
  
  toggleDropdown(){
    this.showDropdown = !this.showDropdown
  }

  toMobileSignin(){
    this.router.navigate(['/signin-mobile'])
  }

  toPageNotFound(){
    this.router.navigate(['/page-not-found'])
  }

}
