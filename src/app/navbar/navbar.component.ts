import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IconDefinition,
  faAngleDown,
  faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { Address } from 'src/shared/model/user.model';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { UserService } from 'src/shared/service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showDropdown: boolean = false;
  faAngleDown: IconDefinition = faAngleDown;
  faAngleUp: IconDefinition = faAngleUp;
  userId: string = null;
  userCity: string = '';
  userLoc: string = null;
  isAdmin = false;
  addresses: Address[]

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Retrieve userId from localStorage using the LocalStorageService
    this.userId = this.localStorage.getItem('userId');
    // Retrieve if user is admin
    this.isAdmin = this.userService.isAdmin();
    // Retrieve current user loc
    this.userLoc = this.localStorage.getItem('userLoc')
    // Retrieve all stored address
    this.userService.getAddresses(this.userId)
    .subscribe(
      addresses => {
        this.addresses = addresses
      }
    )
    // Retrieve current user city
    this.userCity = this.userService.getCurrentUserCity()
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toDashboard() {
    this.router.navigate(['/dashboard']);
  }

  formatAddress(address: Address){
    return address.receiver + " : " + address.type
  }

  setCurrentAddress(address: Address){
    this.userLoc = address.location
    this.userCity = address.city
    this.userService.setCurrentUserLoc(address)
    this.userService.setCurrentUserCity(address.city)
  }
}
