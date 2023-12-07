import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Address, User, Vehicle } from 'src/shared/model/user.model';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { UserService } from 'src/shared/service/user.service';
import { generateUUID } from 'src/shared/utils/helper';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  userId: string = '';
  isLoading: boolean;
  currentUser: User;
  constructor(
    private userService: UserService,
    private snackbar: MatSnackBar,
    private localStorageService: LocalStorageService,
  ) {}
  userEditForm: FormGroup = null;

  ngOnInit(): void {
    this.userEditForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      receiver: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      vehicleModel: new FormControl(null, [Validators.required]),
      vehicleColor: new FormControl(null, [Validators.required]),
      vehicleFuelType: new FormControl(null, [Validators.required]),
      vehicleCarType: new FormControl(null, [Validators.required]),
    });
  }

  onUpdateUserDetails() {
    // get userId from localStorage
    const userId: string = this.localStorageService.getItem('userId');
    // Checks if the user's name input has been updated.
    if (this.userEditForm.value.name) {
      this.userService
        .setUserName(userId, this.userEditForm.value.name)
        .subscribe(
          (response) => {
            this.snackbar.open('Name change successfully', 'Dismiss', {
              duration: 3000, // Snackbar duration in milliseconds
              horizontalPosition: 'center', // Position of the snackbar on screen
              verticalPosition: 'bottom', // Position of the snackbar on screen
            });
            this.userEditForm.reset();
          },
          (err) => {
            this.snackbar.open(
              'An error occurred while changing address. Please try again later.',
              'Dismiss',
              {
                duration: 3000, // Snackbar duration in milliseconds
                horizontalPosition: 'center', // Position of the snackbar on screen
                verticalPosition: 'bottom', // Position of the snackbar on screen
              }
            );
            this.userEditForm.reset();
          }
        );
    }
    // Checks if the user input type, receiver & location to update address.
    if (
      this.userEditForm.value.type ||
      this.userEditForm.value.receiver ||
      this.userEditForm.value.location
    ) {
      // create address object
      const newAddress: Address = {
        addressId: 'A' + generateUUID(),
        type: this.userEditForm.value.type,
        receiver: this.userEditForm.value.receiver,
        location: this.userEditForm.value.location,
        phone: this.userEditForm.value.phone,
        city: this.userEditForm.value.city
      };
      // make call to save address
      this.userService.saveAddress(userId, newAddress).subscribe(
        (response) => {
          this.snackbar.open('Address added successfully', 'Dismiss', {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom', // Position of the snackbar on screen
          });
          this.userEditForm.reset();
        },
        (error) => {
          this.snackbar.open(
            'An error occurred while saving address. Please try again later.',
            'Dismiss',
            {
              duration: 3000, // Snackbar duration in milliseconds
              horizontalPosition: 'center', // Position of the snackbar on screen
              verticalPosition: 'bottom', // Position of the snackbar on screen
            }
          );
          this.userEditForm.reset();
        }
      );
    }
    // Checks if the user input vehicleColor, vehicleModel, vehicleFuelType  & vehicleCarType to update vehicle    
    if (
      this.userEditForm.value.vehicleModel ||
      this.userEditForm.value.vehicleColor ||
      this.userEditForm.value.vehicleFuelType ||
      this.userEditForm.value.vehicleCarType
    ) {
      // create vehicle object
      const newVehicle: Vehicle = {
        vehicleId: 'V' + generateUUID(),
        vehicleModel: this.userEditForm.value.vehicleModel,
        vehicleColor: this.userEditForm.value.vehicleColor,
        vehicleFuelType: this.userEditForm.value.vehicleFuelType,
        vehicleCarType: this.userEditForm.value.vehicleCarType,
      };
      // make API call to save vehicle
      this.userService.saveVehicle(userId, newVehicle).subscribe(
        (res) => {
          this.snackbar.open('Vehicle addedd successfully', 'Dismiss', {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom', // Position of the snackbar on screen
          });
          this.userEditForm.reset();
        },
        (error) => {
          this.snackbar.open(
            'An error occurred while saving vehicle. Please try again later.',
            'Dismiss',
            {
              duration: 3000, // Snackbar duration in milliseconds
              horizontalPosition: 'center', // Position of the snackbar on screen
              verticalPosition: 'bottom', // Position of the snackbar on screen
            }
          );
          this.userEditForm.reset();
        }
      );
    }
  }
}
