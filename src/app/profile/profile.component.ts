import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EditAddressDialogComponent } from 'src/shared/component/edit-address-dialog/edit-address-dialog.component';
import { User } from 'src/shared/model/user.model';
import { UserService } from 'src/shared/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  expandedIndex: number = 0;
  activeTab: string = "vehicle"
  isLoading: boolean;
  constructor(
    private router: Router,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private editAddressDialog: MatDialog,
  ){}
  currentUser: User
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // Gets the 'id' parameter 
      const userId = params.get('id');
      this.isLoading = true;
      this.userService.getUserById(userId).subscribe(
        (user) => {
          // get current user details
          this.currentUser = user;
          this.isLoading = false;
        },
        (error) => {
          this.snackbar.open(
            'An error occurred while loading user details. Please try again later.',
            'Dismiss',
            {
              duration: 3000, // Snackbar duration in milliseconds
              horizontalPosition: 'center', // Position of the snackbar on screen
              verticalPosition: 'bottom', // Position of the snackbar on screen
            }
          );
          this.isLoading = false;
        }
      );
    });
    this.isAdmin = this.userService.isAdmin()
  }
  
  public selectActiveTab(tab: string){
    this.activeTab = tab
  }
  public onEditUserDetails(){
    this.router.navigate(['profile/edit', this.currentUser.userId])
  }
  public openEditAddressDialog(address){
    this.editAddressDialog.open(EditAddressDialogComponent, {
      data: address
    })
  }
}
