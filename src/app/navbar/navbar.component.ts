import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'src/shared/service/localStorage.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
    showDropdown: boolean = false
    faAngleDown: IconDefinition = faAngleDown;
    faAngleUp: IconDefinition = faAngleUp;
    userId: string = null

    constructor(private router: Router, private localStorage: LocalStorageService){}

    ngOnInit(): void {
      this.userId = this.localStorage.getItem('userId')
    }

    toggleDropdown(){
      this.showDropdown = !this.showDropdown
    }

    toDashboard(){
      this.router.navigate(['/dashboard'])
    }

    toProfile(){
      this.router.navigate(['/profile', this.userId])
    }
}
