import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/shared/service/cart.service';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuelItem } from 'src/shared/model/fuel.model';
import {generateUUID} from 'src/shared/utils/helper';
import { convertFuelUnit } from 'src/shared/utils/helper'

@Component({
  selector: 'app-fuel-detail-dialog',
  templateUrl: './fuel-detail-dialog.component.html',
  styleUrls: ['./fuel-detail-dialog.component.css']
})
export class FuelDetailDialogComponent implements OnInit{
  userRole: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data, 
    public dialogRef: MatDialogRef<FuelDetailDialogComponent> ,
    private cartService: CartService, 
    private localStorageService: LocalStorageService,
    private snackbar: MatSnackBar){}

  addToCartForm: FormGroup = null;

  ngOnInit(): void {
    this.addToCartForm = new FormGroup({
      'quantity': new FormControl(null, [Validators.required, Validators.min(1)]),
      'unit': new FormControl(null, [Validators.required])
    })
    this.userRole = this.localStorageService.getItem('userRole')
  }

  isQuantityValid(): boolean {
    return (
      !this.addToCartForm.get('quantity').valid &&
      this.addToCartForm.get('quantity').touched &&
      this.addToCartForm.get('quantity').errors?.['required'] ||
      this.addToCartForm.get('quantity').errors?.['min']
    )
  }

  isUnitValid(): boolean {
    return (
      !this.addToCartForm.get('unit').valid &&
      this.addToCartForm.get('unit').touched &&
      this.addToCartForm.get('unit').errors?.['required']
    )
  }


  /**
   * Function to add a fuel item to the cart
   */
  onAddToCart(){
    if(!this.addToCartForm.valid) {
      this.snackbar.open("Please check the form and make sure all required fields are filled out correctly.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
    } 
    else{
      // perform unit conversion
      const unit = this.addToCartForm.value["unit"]
      const quantity = this.addToCartForm.value["quantity"]
      let fuelQuantity
      if(unit === "liters") fuelQuantity = quantity
      else
        fuelQuantity = convertFuelUnit(quantity, this.data.fuelDetails.fuelType, unit)
      
      console.log("fuelQuantity: ",fuelQuantity)
      if(fuelQuantity > this.data.fuelDetails.fuelStock){
        this.snackbar.open("The required quantity exceeds the fuel in stock. Please select different supplier", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })  
        return
      }
      const userId: string = this.localStorageService.getItem('userId'); 
      const fuelItem: FuelItem = {
        // generate random UUID 
        fuelItemId: generateUUID(),
        fuelTypeId: this.data.fuelDetails.fuelId,
        fuelQuantity: fuelQuantity,
        fuelUnit: "Liters"
      }  
      console.log("fuelItem:", fuelItem)
      this.cartService.addItemToCart(userId, fuelItem).subscribe(
      cart => {
        this.snackbar.open("Item added to cart successfully.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
        this.dialogRef.close()
      },
      error => {
        this.snackbar.open("An error occurred while adding the item to cart. Please try again later.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
        this.dialogRef.close()
      })
    }
  }


}
