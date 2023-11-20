import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/shared/service/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-status-dialog',
  templateUrl: './update-status-dialog.component.html',
  styleUrls: ['./update-status-dialog.component.css']
})
export class UpdateStatusDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<UpdateStatusDialogComponent>,
    private orderService: OrderService,
    private snackbar: MatSnackBar
  ){}
  updateStatusForm: FormGroup = null;
  ngOnInit(): void {
    this.updateStatusForm = new FormGroup({
      'status': new FormControl(null, [Validators.required]),
    })
  }
  onUpdateStatus(){
    const status = this.updateStatusForm.value["status"]
    this.orderService.updateOrderStatus(this.data.orderId, status)
    .subscribe(
    res => {
      this.snackbar.open("Order status is updated successfully.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
    }, err => {
      this.snackbar.open("An error occurred while updating the order status. Please try again later.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
      this.dialogRef.close()
    })
  }
}
