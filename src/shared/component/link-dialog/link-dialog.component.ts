import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-link-dialog',
  templateUrl: './link-dialog.component.html',
  styleUrls: ['./link-dialog.component.css']
})
export class LinkDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<LinkDialogComponent>,
  ){}
  
  /**
   * Function to redirect the user to the payment link or invoice URL
   */
  redirectUser(){
    if(this.data.type === "paymentLink")
      // window.location.href = this.data.info.paymentLinkURL
      window.open(this.data.info.paymentLinkURL)
    else if(this.data.type === "invoice")
      // window.location.href = this.data.info.invoiceURL
      window.open(this.data.info.invoiceURL)
  }
}
