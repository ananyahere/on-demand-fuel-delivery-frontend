import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { UserService } from 'src/shared/service/user.service';

@Component({
  selector: 'app-edit-address-dialog',
  templateUrl: './edit-address-dialog.component.html',
  styleUrls: ['./edit-address-dialog.component.css'],
})
export class EditAddressDialogComponent implements OnInit{
  editAddressForm: FormGroup = null;
  userId: string
  constructor(
    @Inject(MAT_DIALOG_DATA) public data, 
    private fb: FormBuilder,
    private userService: UserService,
    private locationStorageService: LocalStorageService,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<EditAddressDialogComponent>) {
    this.editAddressForm = this.fb.group({
      type: new FormControl(this.data.type),
      receiver: new FormControl(this.data.receiver),
      location: new FormControl(this.data.location),
      city: new FormControl(this.data?.city ? this.data.city : null),
      phone: new FormControl(this.data?.phone ? this.data.phone : null),
    });
  }

  ngOnInit(): void {
    this.userId = this.locationStorageService.getItem('userId')
  }

  onEditAddress() {
    // edit address body
    const updateAddress = {
      type: this.editAddressForm.value["type"] ? this.editAddressForm.value["type"] : undefined,
      receiver: this.editAddressForm.value["receiver"] ? this.editAddressForm.value["receiver"] : undefined,
      location: this.editAddressForm.value["location"] ? this.editAddressForm.value["location"] : undefined,
      city: this.editAddressForm.value["city"] ? this.editAddressForm.value["city"] : undefined,
      phone: this.editAddressForm.value["phone"] ? this.editAddressForm.value["phone"] : undefined
    }
    console.log(updateAddress)
    this.userService.editAddress(this.userId, this.data.addressId, updateAddress).subscribe(
      response => {
        console.log(response)
        this.snackbar.open("Address is updated successfully.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
        this.dialogRef.close()
      },
      err => {
        this.snackbar.open("An error occurred while updating the address. Please try again later.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
      }
    )
  }
}
