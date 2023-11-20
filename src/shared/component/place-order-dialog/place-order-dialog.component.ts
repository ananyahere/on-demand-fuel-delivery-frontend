import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { UserService } from 'src/shared/service/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay } from 'rxjs/operators';
import { generateDateTimeStamp } from 'src/shared/utils/helper'
import { OrderService } from 'src/shared/service/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-order-dialog',
  templateUrl: './place-order-dialog.component.html',
  styleUrls: ['./place-order-dialog.component.css'],
})
export class PlaceOrderDialogComponent implements OnInit {
  checkoutOrderForm: FormGroup;
  cities: string[] = ['New York', 'Los Angeles', 'Chicago']; // example list of cities
  addresses: string[] = ['123 Main St', '456 Elm St', '789 Oak Ave']; // example list of addresses
  addressesDetail = []
  isLoadingAddresses: boolean = false;
  total = 0;
  taxes = 0;
  shipping = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<PlaceOrderDialogComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private snackbar: MatSnackBar,
    private orderSerive: OrderService,
    private router: Router
  ) {
    console.log(data)
    this.checkoutOrderForm = this.fb.group({
      city: [null, Validators.required],
      address: [null, Validators.required],
      immediate: true,
      scheduleTime: null,
      scheduleDate: null,
    });
  }

  ngOnInit(): void {
    this.cities = this.userService.getCities();
    const userId: string = this.localStorageService.getItem('userId');
    this.isLoadingAddresses = true;
    this.userService.getAddresses(userId)
    .pipe(delay(2000))
    .subscribe(
    addresses => {
      let userAddresses: string[] = []
      this.addressesDetail = addresses
      addresses.forEach(address => {
        let userAddress = address.type+ " - " +address.location
        userAddresses.push(userAddress);
      })
      this.addresses = userAddresses
      this.isLoadingAddresses = false
    }, 
    error => {
      console.log(error)
      this.isLoadingAddresses = false;
      this.snackbar.open("An error occurred while loading user addresses. Please try again later.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
      this.dialogRef.close()
      
    })

    // Add listeners to form controls
    this.checkoutOrderForm.valueChanges.subscribe(() => {
      this.shipping = this.calculateShipping();
      this.taxes = this.calculateTaxes();
      this.total = this.calculateTotal();
    });
  }


  isImmediateDelivery() {
    return this.checkoutOrderForm.get('immediate').value;
  }

  onCheckoutOrder() {
    // get userId
    const userId = this.localStorageService.getItem('userId')
    // get address details from addressId
    const selectedAddressType = this.extractAddressType(this.checkoutOrderForm.value["address"])
    const selectedAddress = this.searchAddressByType(this.addressesDetail, selectedAddressType)[0]
    let isImmediate  = this.checkoutOrderForm.value["immediate"]
    // create order object
    let currentOrder = {
      userId: userId,
      deliveryLoc: {
        addressId: selectedAddress.addressId, 
        type: selectedAddress.type,
        reciever: selectedAddress.receiver,
        location: selectedAddress.location
      },
      totalAmount: this.total,
      scheduledTime: isImmediate ? null : new Date(generateDateTimeStamp(this.checkoutOrderForm.value["scheduleDate"], this.checkoutOrderForm.value["scheduleTime"])),
      orderItemsWithDetails: null,
      orderItems: this.data.orderItems,
      isImmediate: this.checkoutOrderForm.value["immediate"],
    }
    console.log("payload order to place-order: ", currentOrder)
    this.orderSerive.placeOrder(currentOrder)
    .subscribe(
    response => {
      let orderId = response.orderId
      this.snackbar.open("Order placed successfully", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
      // redirect user to order detail-page
      this.router.navigate(['/orders', orderId]);
    }, 
    error => {
      this.snackbar.open("An error occurred while placing order. Please try again later.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
    })

    this.dialogRef.close();
  }

  calculateTotal() {
    return this.taxes + this.shipping + this.data.subtotal;
  }

  calculateTaxes() {
    return this.data.subtotal * 0.05;
  }

  calculateShipping() {
    const city = this.checkoutOrderForm.get('city').value;
    const cityRate = this.userService.getCityRate(city);
    const weight = this.checkoutOrderForm.get('immediate') ? 10 : 5;
    return cityRate * weight;
  }

  private extractAddressType(location: string): string {
    const locationParts = location.split(' - ');
    return locationParts[0];
  }
  private searchAddressByType(addresses, type: string) {
    const results = addresses.filter(address => address.type === type);
    return results;
  }
}
