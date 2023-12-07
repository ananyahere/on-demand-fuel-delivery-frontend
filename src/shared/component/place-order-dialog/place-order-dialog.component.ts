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
import { Address } from 'src/shared/model/user.model';
import { FuelService } from 'src/shared/service/fuel.service';
import { formatDate } from 'src/shared/utils/helper'

@Component({
  selector: 'app-place-order-dialog',
  templateUrl: './place-order-dialog.component.html',
  styleUrls: ['./place-order-dialog.component.css'],
})
export class PlaceOrderDialogComponent implements OnInit {
  checkoutOrderForm: FormGroup;
  addresses: string[]
  addressesDetail = []
  isLoadingAddresses: boolean = false;
  total = 0;
  taxes = 0;
  shipping = 0;
  warehouseLoc: string = "Devender Colony, Kompally, Hyderabad, Telangana";
  warehouseCity: string = "Hyderabad";
  deliveryDate: string = ""

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<PlaceOrderDialogComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private fuelService: FuelService,
    private localStorageService: LocalStorageService,
    private snackbar: MatSnackBar,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutOrderForm = this.fb.group({
      address: [null, Validators.required],
      immediate: true,
      isCurrentLoc: true,
      scheduleTime: ["00:00"],
      scheduleDate: null,
    });
  }

  ngOnInit(): void {
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
      this.isLoadingAddresses = false;
      this.snackbar.open("An error occurred while loading user addresses. Please try again later.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
      this.dialogRef.close()
    })

    this.getWarehouseForUserLoc()
    // Add listeners to form controls
    this.checkoutOrderForm.valueChanges.subscribe(() => {
      this.getWarehouseForUserLoc();
      this.deliveryDate =  formatDate(this.calculateDeliveryTime().toDateString());
      this.shipping = this.calculateShipping();
      this.taxes = this.calculateTaxes();
      this.total = this.calculateTotal();
    });
  }

  isImmediateDelivery(): boolean{
    return this.checkoutOrderForm.get('immediate').value;
  }

  isCurrentLoc(): boolean{
    return this.checkoutOrderForm.get('isCurrentLoc').value
  }

  isScheduled(): boolean{
    return this.checkoutOrderForm.get('scheduleDate') ? true : false;
  }

  onCheckoutOrder() {
    // get userId
    const userId = this.localStorageService.getItem('userId')
    let isImmediate  = this.checkoutOrderForm.value["immediate"]
    let isCurrentLoc = this.checkoutOrderForm.value["isCurrentLoc"]
    // get user current location
    const userLoc: Address = this.userService.getCurrentUserLoc()
    console.log("userLoc:", userLoc)
    // create order object
    let currentOrder = {
      userId: userId,
      deliveryLoc: isCurrentLoc ? userLoc : this.getDeliveryLoc(),
      totalAmount: this.total,
      scheduledTime: isImmediate ? null : new Date(generateDateTimeStamp(this.checkoutOrderForm.value["scheduleDate"], this.checkoutOrderForm.value["scheduleTime"])),
      orderItemsWithDetails: null,
      orderItems: this.data.orderItems,
      isImmediate: this.checkoutOrderForm.value["immediate"],
      deliveryTime: this.calculateDeliveryTime()
    }
    console.log("createdOrderObject: ", currentOrder)
    this.orderService.placeOrder(currentOrder)
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

  private getDeliveryLoc(): Address{
    // get address details from addressId
    const selectedAddressType = this.extractAddressType(this.checkoutOrderForm.value["address"])
    const selectedAddress = this.searchAddressByType(this.addressesDetail, selectedAddressType)[0]
    return {
      addressId: selectedAddress.addressId, 
      type: selectedAddress.type,
      receiver: selectedAddress.receiver,
      location: selectedAddress.location,
      phone: selectedAddress.phone,
      city: selectedAddress.city
    }
  }

  private calculateDeliveryTime(): Date {
    // if scheduled date is set, set delivery date to scheduled date
    if(!this.isImmediateDelivery() && this.isScheduled()) return new Date(this.checkoutOrderForm.value["scheduleDate"])
    
    let selectedAddress: Address = null
    // get delivery address
    if(this.isCurrentLoc()) selectedAddress = this.userService.getCurrentUserLoc()
    else{
      const selectedAddressType = this.extractAddressType(this.checkoutOrderForm.value["address"])
      selectedAddress = this.searchAddressByType(this.addressesDetail, selectedAddressType)[0]
    }
    // get user's city 
    let userCity: string = null
    if(this.isCurrentLoc()) userCity = this.userService.getCurrentUserCity()
    else userCity = selectedAddress.city
    console.log("userCity: ", userCity)
    const currDate = new Date()
    const deliveryRate = this.userService.getCityDeliveryRate(userCity)
    let deliveryDate: Date = currDate
    console.log("this.isImmediateDelivery(): ", this.isImmediateDelivery())
    // check if immediate delivery
    if(this.isImmediateDelivery()){
      deliveryDate.setTime(currDate.getTime() + deliveryRate * 60 * 60 * 1000)
    } else {
      deliveryDate.setDate(currDate.getDate() + deliveryRate)
    }
    console.log("deliveryDate: ",deliveryDate)
    return deliveryDate
  }

  calculateTotal() {
    return this.taxes + this.shipping + this.data.subtotal;
  }

  calculateTaxes() {
    return this.data.subtotal * 0.05;
  }

  calculateShipping() {
    // calculate shipping based on warehouseCity
    const city = this.warehouseCity;
    const cityRate = this.userService.getCityRate(city);
    const weight = this.checkoutOrderForm.get('immediate') ? 10 : 5;
    return cityRate * weight;
  }

  private extractAddressType(location: string): string {
    const locationParts = location.split(' - ');
    return locationParts[0];
  }

  private searchAddressByType(addresses: Address[], type: string) {
    const results = addresses.filter(address => address.type === type);
    return results;
  }

  private getWarehouseForUserLoc(){
    let selectedAddress: Address = null
    // get delivery city
    if(this.isCurrentLoc()) selectedAddress = this.userService.getCurrentUserLoc()
    else{
      const selectedAddressType = this.extractAddressType(this.checkoutOrderForm.value["address"])
      selectedAddress = this.searchAddressByType(this.addressesDetail, selectedAddressType)[0]
    }
    const userDeliveryCity = selectedAddress.city
    const warehouses = this.fuelService.getWarehouses();
    // map user's delivery city to warehouse details
    switch(userDeliveryCity){
      case 'Hyderabad':
        this.warehouseCity = warehouses.find(obj => obj.city == 'Hyderabad')["city"]
        this.warehouseLoc = warehouses.find(obj => obj.city == 'Hyderabad')["location"]
        break;
      case 'Bangalore':
        this.warehouseCity = warehouses.find(obj => obj.city == 'Bangalore')["city"]
        this.warehouseLoc = warehouses.find(obj => obj.city == 'Bangalore')["location"]
        break;
      case 'Bhubaneswar':
        this.warehouseCity = warehouses.find(obj => obj.city == 'Bhubaneswar')["city"]
        this.warehouseLoc = warehouses.find(obj => obj.city == 'Bhubaneswar')["location"]
        break;
      default:
        this.warehouseCity = "Hyderabad"
        this.warehouseLoc = "Devender Colony, Kompally, Hyderabad, Telangana"
    }
  }
}
