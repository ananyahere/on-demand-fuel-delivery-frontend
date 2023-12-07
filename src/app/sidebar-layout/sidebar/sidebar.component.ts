import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/service/auth.service';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { UserService } from 'src/shared/service/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
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

  onLogout(){
    this.authService.logOut();
    this.router.navigate(['/']);
  }
}
