import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fuel } from 'src/shared/model/fuel.model';
import { FuelService } from 'src/shared/service/fuel.service';

@Component({
  selector: 'app-add-fuel-tank',
  templateUrl: './add-fuel-tank.component.html',
  styleUrls: ['./add-fuel-tank.component.css']
})
export class AddFuelTankComponent {
  addFuelTankForm: FormGroup = null;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private fuelService: FuelService
  ){
    this.addFuelTankForm = this.fb.group({
      fuelType: new FormControl(null, [Validators.required]),
      fuelStock: new FormControl(500, [Validators.required]),
      supplierName: new FormControl(null, [Validators.required]),
      supplierEmail: new FormControl(null, [Validators.required]),
      supplierContact: new FormControl(null, [Validators.required]),
      basePriceHyd: new FormControl(null, [Validators.required]),
      basePriceBlr: new FormControl(null, [Validators.required]),
      basePriceBhu: new FormControl(null, [Validators.required])
    })
  }

  onAddTank(){
    if(!this.addFuelTankForm.valid){
      this.snackbar.open('Please enter appropiate values to all the fields.', 'Dismiss', {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom', // Position of the snackbar on screen
      });
    } else{
      // create fuel entity
      const createdFuelTank = {
        fuelType: this.addFuelTankForm.value["fuelType"],
        fuelStock: this.addFuelTankForm.value["fuelStock"],
        fuelStockUnit: "Liters",
        fuelSupplier: {
          name: this.addFuelTankForm.value["supplierName"],
          contact: this.addFuelTankForm.value["supplierContact"],
          email: this.addFuelTankForm.value["supplierEmail"]
        },
        basePriceHyd: this.addFuelTankForm.value["basePriceHyd"],
        basePriceBlr: this.addFuelTankForm.value["basePriceBlr"],
        basePriceBhu: this.addFuelTankForm.value["basePriceBhu"]
      }

      this.fuelService.addFuel(createdFuelTank).subscribe(
        response => {
          this.snackbar.open("Tank added successfully", "Dismiss", {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom' // Position of the snackbar on screen
          })
          this.addFuelTankForm.reset();
        },
        error => {
          this.snackbar.open("An error occurred while adding tank. Please try again later.", "Dismiss", {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom' // Position of the snackbar on screen
          })
        }
      )

    }
  }
}
