import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/shared/service/auth.service';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { UserService } from 'src/shared/service/user.service';

@Component({
  selector: 'app-sidebar-mobile',
  templateUrl: './sidebar-mobile.component.html',
  styleUrls: ['./sidebar-mobile.component.css']
})
export class SidebarMobileComponent {
  @Output() closeSidebar = new EventEmitter();
  faTimes: IconDefinition = faTimes;
  userId: string = null;
  isAdmin: boolean = false;

  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ){}

  ngOnInit(): void {
    // Retrieve userId from localStorage using the LocalStorageService
    this.userId = this.localStorage.getItem('userId'); 
    this.isAdmin = this.userService.isAdmin();
  }

  public onClosePopup(){
    this.closeSidebar.emit()
  }

  onLogout(){
    this.authService.logOut();
    this.router.navigate(['/']);
  }
}
