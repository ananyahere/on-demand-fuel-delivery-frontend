import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/shared/model/user.model';
import { UserService } from 'src/shared/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;
  activeTab: string = "vehicle"
  isLoading: boolean;
  constructor(
    private router: Router,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute
  ){}
  currentUser: User = {
    userId: "U001",
    name: "John Doe",
    email: "johndoe@example.com",
    addresses: [
      {
        addressId: null,
        type: "Home",
        receiver: "John Doe",
        location: "123 Main Street, Springfield"
      },
      {
        addressId: null,
        type: "Work",
        receiver: "John Doe",
        location: "456 Broad Avenue, Gotham City"
      }
    ],
    vehicles: [
      {
        vehicleId: "V001",
        vehicleModel: "Toyota Camry",
        vehicleColor: "Red",
        vehicleFuelType: "Petrol",
        vehicleCarType: "Sedan"
      },
      {
        vehicleId: "V002",
        vehicleModel: "Honda Civic",
        vehicleColor: "Blue",
        vehicleFuelType: "Petrol",
        vehicleCarType: "Sedan"
      }
    ],
    paymentMethods: [
      "Credit Card",
      "Debit Card"
    ]
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');
      this.isLoading = true;
      this.userService.getUserById(userId).subscribe(
        (user) => {
          console.log('getUserById: ', user);
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
          this.currentUser = {
            userId: 'U001',
            name: 'John Doe',
            email: 'johndoe@example.com',
            addresses: [
              {
                addressId: null,
                type: 'Home',
                receiver: 'John Doe',
                location: '123 Main Street, Springfield',
              },
              {
                addressId: null,
                type: 'Work',
                receiver: 'John Doe',
                location: '456 Broad Avenue, Gotham City',
              },
            ],
            vehicles: [
              {
                vehicleId: 'V001',
                vehicleModel: 'Toyota Camry',
                vehicleColor: 'Red',
                vehicleFuelType: 'Petrol',
                vehicleCarType: 'Sedan',
              },
              {
                vehicleId: 'V002',
                vehicleModel: 'Honda Civic',
                vehicleColor: 'Blue',
                vehicleFuelType: 'Petrol',
                vehicleCarType: 'Sedan',
              },
            ],
            paymentMethods: ['Credit Card', 'Debit Card'],
          };
          this.isLoading = false;
        }
      );
    });
  }
  
  public selectActiveTab(tab: string){
    this.activeTab = tab
  }
  public onEditUserDetails(){
    this.router.navigate(['profile/edit', this.currentUser.userId])
  }
}
