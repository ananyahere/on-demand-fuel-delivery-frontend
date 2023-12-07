import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/shared/model/order.model';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OrderService } from 'src/shared/service/order.service';
import { formatDate } from 'src/shared/utils/helper';
import { Router } from '@angular/router';
import { UserService } from 'src/shared/service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UpdateStatusDialogComponent } from 'src/shared/component/update-status-dialog/update-status-dialog.component';
import { OrderDetailsEmailWriteupComponent } from 'src/shared/component/order-details-email-writeup/order-details-email-writeup.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  isAdmin = false;
  isLoading = false;
  pageIndex = 0;
  pageSize = 3;
  paginatorLength: number = 3;
  filterOrderHistoryForm: FormGroup = null;
  orderHistory: Order[] = [
    {
      orderId: '654fcdd23dc4e384200bf20f',
      userId: '654e899a1adc477a43b0b9e7',
      deliveryLoc: {
        addressId: 'A001',
        type: 'Home',
        receiver: 'John Doe',
        location: '123 Main St, Anytown, CA 12345',
        phone: '9876543210',
        city: 'Anytown',
      },
      deliveryOtp: '123456',
      orderStatus: 'Pending',
      totalAmount: 50.99,
      orderTime: '2022-10-01T04:30:00.000+00:00',
      scheduledTime: null,
      deliveryTime: null,
      orderItems: null,
      orderItemsWithDetails: [
        {
          fuelItemId: 'FI001',
          fuelTypeId: '654e8bf71adc477a43b0b9f1',
          fuelQuantity: 10,
          fuelUnit: 'Liters',
          fuelDetail: {
            fuelId: '654e8bf71adc477a43b0b9f1',
            fuelType: 'Petrol',
            fuelStock: 350,
            fuelStockUnit: 'Litres',
            fuelSupplier: {
              name: 'Supplier A',
              contact: '9876543210',
              email: 'supplierA@gmail.com',
            },
            basePriceHyd: 85,
            basePriceBlr: 86,
            basePriceBhu: 87,
          },
        },
      ],
      immediate: true,
    },
    {
      orderId: '655100f74b22d42facbe414f',
      userId: '654e899a1adc477a43b0b9e7',
      deliveryLoc: {
        addressId: 'A001',
        type: 'Home',
        receiver: 'John Doe',
        location: '123 Main St, Anytown, CA 12345',
        phone: '9876543210',
        city: 'Anytown',
      },
      deliveryOtp: '123456',
      orderStatus: 'Received',
      totalAmount: 150.99,
      orderTime: '2023-11-12T16:44:39.174+00:00',
      scheduledTime: null,
      deliveryTime: null,
      orderItems: null,
      orderItemsWithDetails: [
        {
          fuelItemId: 'FI001',
          fuelTypeId: '654e8bf71adc477a43b0b9f1',
          fuelQuantity: 10,
          fuelUnit: 'Liters',
          fuelDetail: {
            fuelId: '654e8bf71adc477a43b0b9f1',
            fuelType: 'Petrol',
            fuelStock: 350,
            fuelStockUnit: 'Litres',
            fuelSupplier: {
              name: 'Supplier A',
              contact: '9876543210',
              email: 'supplierA@gmail.com',
            },
            basePriceHyd: 85,
            basePriceBlr: 86,
            basePriceBhu: 87,
          },
        },
      ],
      immediate: null,
    },
    {
      orderId: '655100f74b22d42facbe414f',
      userId: '654e899a1adc477a43b0b9e7',
      deliveryLoc: {
        addressId: 'A001',
        type: 'Home',
        receiver: 'John Doe',
        location: '123 Main St, Anytown, CA 12345',
        phone: '9876543210',
        city: 'Anytown',
      },
      deliveryOtp: '123456',
      orderStatus: 'Received',
      totalAmount: 150.99,
      orderTime: '2023-11-12T16:44:39.174+00:00',
      scheduledTime: null,
      deliveryTime: null,
      orderItems: null,
      orderItemsWithDetails: [
        {
          fuelItemId: 'FI001',
          fuelTypeId: '654e8bf71adc477a43b0b9f1',
          fuelQuantity: 10,
          fuelUnit: 'Liters',
          fuelDetail: {
            fuelId: '654e8bf71adc477a43b0b9f1',
            fuelType: 'Petrol',
            fuelStock: 350,
            fuelStockUnit: 'Litres',
            fuelSupplier: {
              name: 'Supplier A',
              contact: '9876543210',
              email: 'supplierA@gmail.com',
            },
            basePriceHyd: 85,
            basePriceBlr: 86,
            basePriceBhu: 87,
          },
        },
      ],
      immediate: null,
    },
  ];
  paginatedOrderHistory: Order[] = [];
  mailToUrl: string
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private updateOrderStatusDialog: MatDialog,
    private fb: FormBuilder,
    private emailWriteupDialog: MatDialog,
  ) {
    this.filterOrderHistoryForm = this.fb.group({
      status: ['All'],
      receiver: [null],
    });
  }

  ngOnInit(): void {
    // Retrieve userId from localStorage using the LocalStorageService
    const userId = this.localStorageService.getItem<string>('userId');

    // Retrieve if user is admin
    this.isAdmin = this.userService.isAdmin();

    this.isLoading = true;
    if (!this.isAdmin)
      // Fetch order history of the logged-in user
      this.orderService.getOrderHistoryOfUser(userId).subscribe(
        (orderHistory: Order[]) => {
          this.orderHistory = orderHistory;
          this.isLoading = false;
          // set pagination
          this.paginatedOrderHistory = this.setPagination(
            this.orderHistory,
            this.orderHistory.length,
            this.pageIndex,
            this.pageSize
          );
        },
        (error) => {
          this.snackbar.open(
            'An error occurred while getting order history. Please try again later.',
            'Dismiss',
            {
              duration: 3000, // Snackbar duration in milliseconds
              horizontalPosition: 'center', // Position of the snackbar on screen
              verticalPosition: 'bottom', // Position of the snackbar on screen
            }
          );
        }
      );
    // Fetch order history of all the users
    else
      this.orderService.getOrderHistory().subscribe(
        (orderHistory: Order[]) => {
          this.orderHistory = orderHistory;
          this.paginatorLength = orderHistory.length;
          this.isLoading = false;
          // set pagination
          this.paginatedOrderHistory = this.setPagination(
            this.orderHistory,
            this.orderHistory.length,
            this.pageIndex,
            this.pageSize
          );
        },
        (error) => {
          this.snackbar.open(
            'An error occurred while getting order history. Please try again later.',
            'Dismiss',
            {
              duration: 3000, // Snackbar duration in milliseconds
              horizontalPosition: 'center', // Position of the snackbar on screen
              verticalPosition: 'bottom', // Position of the snackbar on screen
            }
          );
        }
      );

    // filters data with every keystorke
    this.filterOrderHistoryForm.valueChanges.subscribe((value) => {
      // apply filter
      this.paginatedOrderHistory = this.applyFilter(
        value.status,
        value.receiver
      );
      // set paginator
      if (this.paginator)
        this.paginatedOrderHistory = this.setPagination(
          this.paginatedOrderHistory,
          this.paginatedOrderHistory.length,
          0,
          this.pageSize
        );
    });
  }

  formatDateString(date: string) {
    return formatDate(date);
  }

  onOpenDetails(orderId: string) {
    this.router.navigate(['orders', orderId]);
  }

  openUpdateStatusDialog(orderId: string) {
    this.updateOrderStatusDialog.open(UpdateStatusDialogComponent, {
      data: { orderId },
    });
  }

  /**
   *
   * @param event PageEvent object containing page index and page size information
   */
  handlePageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex; // page
    this.pageSize = event.pageSize; // limit
    this.paginatorLength = event.length;
    this.paginatedOrderHistory = this.setPagination(
      this.orderHistory,
      this.paginatorLength,
      this.pageIndex,
      this.pageSize
    );
  }

  setPagination(
    orders: Order[],
    pgLength: number,
    pgIndex: number,
    pgSize: number
  ) {
    this.paginatorLength = pgLength;
    this.pageIndex = pgIndex;
    this.pageSize = pgSize;
    const startIndex = pgIndex * pgSize;
    const endIndex = startIndex + pgSize;
    return orders.slice(startIndex, endIndex);
  }

  applyFilter(orderStatus: string, orderReceiver: string) {
    if (!orderStatus || orderStatus === 'All') orderStatus = '';
    if (!orderReceiver) orderReceiver = '';
    let filteredOrders = [];
    if (this.isAdmin)
      filteredOrders = this.orderHistory.filter(
        (order) =>
          order.orderStatus?.toString().includes(orderStatus) &&
          order.deliveryLoc?.receiver
            ?.toString()
            .toLowerCase()
            .includes(orderReceiver?.toLowerCase())
      );
    else
      filteredOrders = this.orderHistory.filter(
        (order) =>
          order.orderStatus?.toString().includes(orderStatus) &&
          order.deliveryLoc?.type
            ?.toString()
            .toLowerCase()
            .includes(orderReceiver?.toLowerCase())
      );
    return filteredOrders;
  }

  sendEmail(order) {
    const recipient = 'deliveryPartner@example.com';

    let deliveryLoc = order.deliveryLoc;
    let orderItems = order.orderItemsWithDetails;
    let safetyGuidelines = `Please ensure that you have all the necessary information required for the fuel delivery and that you follow a set of pre-cautions to ensure a safe delivery. We request that the delivery person follow these guidelines:
    Use appropriate safety gear like gloves, goggles, and aprons.
    Ensure that the delivery vehicle is in good condition and no fuel leaks are present.
    Verify that the fuel being delivered is the correct type and quantity ordered.
    Do not smoke or allow smoking within 30 feet of the fuel delivery.
    Turn off the delivery vehicle engine before starting the fuel delivery.
    Use a spill containment system with absorbent materials and use caution when handling them.
    In case of a fuel spill, immediately use the spill containment materials to contain the spill and prevent it from spreading.
    Once you have delivered the fuel, please verify the delivery PIN with the receiver to ensure a successful delivery. If you have any questions or concerns regarding this order, please do not hesitate to contact me.
  `;
    let orderDetails = `I hope this message finds you well. I am writing to provide you with the details of an upcoming fuel delivery order that you will be responsible for. The order details are as follows:
      Order ID: ${order.orderId}
      User ID: ${order.userId}
      Delivery Location: ${deliveryLoc.receiver}, ${deliveryLoc.location}, ${deliveryLoc.city}, ${deliveryLoc.phone}
      Delivery PIN: ${order.deliveryOtp}
      Total Amount: ${order.totalAmount}
      Delivery Time: ${order.deliveryTime}
  `;
    let orderItemsDetails = `Order Items with Details:`;
    for (let i = 0; i < orderItems.length; i++) {
      orderItemsDetails += `
      ${i + 1}. Fuel Quantity: ${orderItems[i].fuelQuantity} ${orderItems[i].fuelUnit}
                Fuel Type: ${orderItems[i].fuelDetail.fuelType}
                Fuel ID: ${orderItems[i].fuelDetail.fuelId}
    `;
    }
    // this.mailToUrl = `${encodeURI(orderDetails + orderItemsDetails + safetyGuidelines)}`;
    this.mailToUrl = `mailto:deliveryPartner@example.com?subject=look at this website&body=${orderDetails + orderItemsDetails + safetyGuidelines}`
    this.emailWriteupDialog.open(OrderDetailsEmailWriteupComponent, {
      data: `${orderDetails + orderItemsDetails}`
    })
  }
}
