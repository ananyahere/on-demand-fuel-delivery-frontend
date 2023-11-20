import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Order } from 'src/shared/model/order.model';
import { OrderService } from 'src/shared/service/order.service';
import { formatDate } from 'src/shared/utils/helper'
import { PaymentService } from 'src/shared/service/payment.service';
import { LinkDialogComponent } from 'src/shared/component/link-dialog/link-dialog.component';
import { concat } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements OnInit {
  orderId: string;
  isLoading: boolean = false;
  orderStatus: number = 1;
  deliveryOTP: string = null;
  isOTPSet: boolean = false;
  order = {
    orderId: '654fcdd23dc4e384200bf20f',
    userId: '654e899a1adc477a43b0b9e7',
    deliveryLoc: {
      addressId: 'A001',
      type: 'Home',
      receiver: 'John Doe',
      location: '123 Main St, Anytown, CA 12345',
    },
    orderStatus: 'Pending',
    totalAmount: 50.99,
    orderTime: '2022-10-01T04:30:00.000+00:00',
    scheduledTime: null,
    orderItems: null,
    orderItemsWithDetails: [
      {
        fuelDetail: {
          fuelId: '654e8bf71adc477a43b0b9f1',
          fuelType: 'Petrol',
          fuelStock: 350,
          fuelStockUnit: 'Litres',
          fuelSuppliers: [
            {
              supplierName: 'Supplier A',
              supplierContactNo: '9876543210',
            },
            {
              supplierName: 'Supplier B',
              supplierContactNo: '1234567890',
            },
          ],
          basePriceHyd: 85,
          basePriceBlr: 86,
          basePriceBhu: 87,
        },
        fuelTypeId: '654e8bf71adc477a43b0b9f1',
        fuelQuantity: 10,
        fuelItemId: 'FI001',
      },
    ],
    immediate: true,
  };

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private snackbar: MatSnackBar,
    private paymentService: PaymentService,
    private linkDialog: MatDialog,
  ) {}

  public formateDateString(date: string){
    return formatDate(date);
  }


  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.orderId = params['id'];
      this.order.orderId = this.orderId;
      // to get order details using orderId
      this.isLoading = true;
      this.orderService.getOrderDetailsById(this.orderId).subscribe(
        (order: Order) => {
          console.log(order)
          this.orderStatus = this.getOrderStepNumber(order["orderStatus"])
          this.order = order;
          this.isLoading = false;
          this.deliveryOTP = order.deliveryOtp;
        },
        (error) => {
          this.snackbar.open("An error occurred while loading details. Please try again later.", "Dismiss", {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom' // Position of the snackbar on screen
          })
          this.isLoading = false;
          this.order = {
            "orderId": "654fcdd23dc4e384200bf20f",
            "userId": "654e899a1adc477a43b0b9e7",
            "deliveryLoc": {
                "addressId": "A001",
                "type": "Home",
                "receiver": "John Doe",
                "location": "123 Main St, Anytown, CA 12345"
            },
            "orderStatus": "Pending",
            "totalAmount": 50.99,
            "orderTime": "2022-10-01T04:30:00.000+00:00",
            "scheduledTime": null,
            "orderItems": null,
            "orderItemsWithDetails": [
                {
                    "fuelItemId": "FI001",
                    "fuelTypeId": "654e8bf71adc477a43b0b9f1",
                    "fuelQuantity": 10,
                    // "fuelUnit": "Liters",
                    "fuelDetail": {
                        "fuelId": "654e8bf71adc477a43b0b9f1",
                        "fuelType": "Petrol",
                        "fuelStock": 350.0,
                        "fuelStockUnit": "Litres",
                        "fuelSuppliers": [
                            {
                                "supplierName": "Supplier A",
                                "supplierContactNo": "9876543210"
                            },
                            {
                                "supplierName": "Supplier B",
                                "supplierContactNo": "1234567890"
                            }
                        ],
                        "basePriceHyd": 85.0,
                        "basePriceBlr": 86.0,
                        "basePriceBhu": 87.0
                    }
                }
            ],
            "immediate": true
          }
        }
      );
    });
  }

  public getTotalOrder(){
    let totalAmount = 0;

    // Loop over the orderItemsWithDetails array and add up the cost of each fuelItem
    for (const item of this.order.orderItemsWithDetails) {
      const fuelItem = item.fuelDetail;
      const quantity = item.fuelQuantity;
      const basePrice = fuelItem.basePriceHyd; // We are using basePriceHyd for all fuel items
  
      const itemPrice = quantity * basePrice;
      totalAmount += itemPrice;
    }
  
    return totalAmount;
  }

  private getOrderStepNumber(orderStatus: String): number{
    switch(orderStatus){
      case "Confirmed":
        return 1;
      case "Payment-Received":
        return 2;
      case "En-Route":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  }

  onPaymentUpdate(){
    if(this.orderStatus >= 2) this.generateInvoice()
    else this.generatePaymentLink()
  }

  private generatePaymentLink(){
    this.paymentService.createPaymentLink(this.orderId).subscribe(
      response => {
      // open dialog box
      this.linkDialog.open(LinkDialogComponent, {
        data: {
          type: 'paymentLink',
          info: response
        }
      })
      this.orderStatus = 2
      const paymentLinkId = response.paymentLinkID
      // get payment status

    }, error => {
      this.snackbar.open("An error occurred while generating payment link. Please try again later.", "Dismiss", {
        duration: 3000, // Snackbar duration in milliseconds
        horizontalPosition: 'center', // Position of the snackbar on screen
        verticalPosition: 'bottom' // Position of the snackbar on screen
      })
    })
  }

  private generateInvoice(){
    this.paymentService.createInvoice(this.orderId).subscribe(
      response => {
        console.log(response)
        // open dialog box
        this.linkDialog.open(LinkDialogComponent, {
          data: {
            type: 'invoice',
            info: response
          }
        })
      },
      error => {
        this.snackbar.open("An error occurred while generating invoice. Please try again later.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
      }
    )
  }

  public onGetOTPInfo(){
    if(this.deliveryOTP) this.isOTPSet = !this.isOTPSet;
    // API call to get generate OTP
    else{
      this.orderService.getDeliveryOTP(this.orderId)
      .subscribe(res => {
        console.log(res)
        this.deliveryOTP = res.deliveryOtp
        this.snackbar.open("Delivery PIN successfully generated.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
      },
      err => {
        console.log(err)
        this.snackbar.open("An error occurred while generating delivery PIN. Please try again later.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
      })
    }
  }

}
