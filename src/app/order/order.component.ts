import { Component, OnInit } from '@angular/core';
import { Order } from 'src/shared/model/order.model';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { OrderService } from 'src/shared/service/order.service';
import { formatDate } from 'src/shared/utils/helper';
import { Router } from '@angular/router';
import { UserService } from 'src/shared/service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UpdateStatusDialogComponent } from 'src/shared/component/update-status-dialog/update-status-dialog.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  isAdmin = false;
  orderHistory: Order[] = [
    {
      orderId: "654fcdd23dc4e384200bf20f",
      userId: "654e899a1adc477a43b0b9e7",
      deliveryLoc: {
        addressId: "A001",
        type: "Home",
        receiver: "John Doe",
        location: "123 Main St, Anytown, CA 12345"
      },
      deliveryOtp: "123456",
      orderStatus: "Pending",
      totalAmount: 50.99,
      orderTime: "2022-10-01T04:30:00.000+00:00",
      scheduledTime: null,
      orderItems: null,
      orderItemsWithDetails: [
        {
          fuelItemId: "FI001",
          fuelTypeId: "654e8bf71adc477a43b0b9f1",
          fuelQuantity: 10,
          fuelUnit: 'Liters',
          fuelDetail: {
            fuelId: "654e8bf71adc477a43b0b9f1",
            fuelType: "Petrol",
            fuelStock: 350,
            fuelStockUnit: "Litres",
            fuelSuppliers: [
              {
                supplierName: "Supplier A",
                supplierContactNo: "9876543210"
              },
              {
                supplierName: "Supplier B",
                supplierContactNo: "1234567890"
              }
            ],
            basePriceHyd: 85,
            basePriceBlr: 86,
            basePriceBhu: 87
          }
        }
      ],
      immediate: true
    },
    {
      orderId: "655100f74b22d42facbe414f",
      userId: "654e899a1adc477a43b0b9e7",
      deliveryLoc: {
        addressId: "A001",
        type: "Home",
        receiver: "John Doe",
        location: "123 Main St, Anytown, CA 12345"
      },
      deliveryOtp: "123456",
      orderStatus: "Received",
      totalAmount: 150.99,
      orderTime: "2023-11-12T16:44:39.174+00:00",
      scheduledTime: null,
      orderItems: null,
      orderItemsWithDetails: [
        {
          fuelItemId: "FI001",
          fuelTypeId: "654e8bf71adc477a43b0b9f1",
          fuelQuantity: 10,
          fuelUnit: 'Liters',
          fuelDetail: {
            fuelId: "654e8bf71adc477a43b0b9f1",
            fuelType: "Petrol",
            fuelStock: 350,
            fuelStockUnit: "Litres",
            fuelSuppliers: [
              {
                supplierName: "Supplier A",
                supplierContactNo: "9876543210"
              },
              {
                supplierName: "Supplier B",
                supplierContactNo: "1234567890"
              }
            ],
            basePriceHyd: 85,
            basePriceBlr: 86,
            basePriceBhu: 87
          }
        }
      ],
      immediate: null
    }
  ]

  constructor(
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private updateOrderStatusDialog: MatDialog
  ) { }


  ngOnInit(): void {
    // Retrieve userId from localStorage using the LocalStorageService
    const userId = this.localStorageService.getItem<string>('userId');

    // Retrieve if user is admin
    this.isAdmin = this.userService.isAdmin();

    if(!this.isAdmin)
      // Fetch order history of the logged-in user
      this.orderService.getOrderHistoryOfUser(userId).subscribe(
        (orderHistory: Order[]) => {
          this.orderHistory = orderHistory;
        },
        (error) => {
          this.snackbar.open("An error occurred while getting order history. Please try again later.", "Dismiss", {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom' // Position of the snackbar on screen
          })
        }
      );
    else
      // Fetch order hstory of all the users
      this.orderService.getOrderHistory().subscribe(
        (orderHistory: Order[]) => {
          this.orderHistory = orderHistory;
        },
        (error) => {
          this.snackbar.open("An error occurred while getting order history. Please try again later.", "Dismiss", {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom' // Position of the snackbar on screen
          })
        }
      )
  }

  formatDateString(date: string){
    return formatDate(date);
  }

  onOpenDetails(orderId: string){
    this.router.navigate(['orders', orderId]);
  }

  openUpdateStatusDialog(orderId: string){
    this.updateOrderStatusDialog.open(UpdateStatusDialogComponent, {
      data: { orderId }
    })
  }

  verifyDeliveryPin(orderId: string){
    // search order by orderId
    // verify delivery pin
  }

}
