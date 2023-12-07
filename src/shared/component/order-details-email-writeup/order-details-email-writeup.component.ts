import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Clipboard} from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-details-email-writeup',
  templateUrl: './order-details-email-writeup.component.html',
  styleUrls: ['./order-details-email-writeup.component.css']
})
export class OrderDetailsEmailWriteupComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data, 
    public dialogRef: MatDialogRef<OrderDetailsEmailWriteupComponent>,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar
  ){}

  closeDialog(){
    this.dialogRef.close()
  }

  copyContent(){
    this.clipboard.copy(this.data);
    this.snackbar.open("Order details copied!", "Dismiss", {
      duration: 3000, // Snackbar duration in milliseconds
      horizontalPosition: 'center', // Position of the snackbar on screen
      verticalPosition: 'bottom' // Position of the snackbar on screen
    })
  }
}
