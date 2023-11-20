import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlaceOrderDialogComponent } from 'src/shared/component/place-order-dialog/place-order-dialog.component';
import { Order } from 'src/shared/model/order.model';
import { OrderService } from 'src/shared/service/order.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent implements OnInit {
  order: Order = {
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
    orderItems: [],
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
  }
  currentOrder: Order
  subtotal: number = 0;

  constructor(
    private orderService: OrderService,
    private placeOrderDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    //subscribe to the orderUpdated BehaviorSubject to listen for changes in currentOrder from the OrderService
    this.orderService.orderUpdated.subscribe((order: Order) => {
      this.currentOrder = order;
    });
  }

  public onRemoveFromOrder(fuelItemId: string){
    this.orderService.removeItemFromOrder(fuelItemId)
  }

  public openPlaceOrderDialog(){
    console.log(this.currentOrder)
    this.placeOrderDialog.open(PlaceOrderDialogComponent, {
      data: { 
        subtotal: this.subtotal,
        orderItems: this.currentOrder.orderItems 
      }
    })
  }

  public calculateOrderSubtotal(): string {
    let subTotal = 0;
    // Loop over the fuelDetailsInCart array and add up the cost of each fuelDetail
    if(this.currentOrder.orderItemsWithDetails === null) return '0.00';
    for (const item of this.currentOrder.orderItemsWithDetails) {
      const fuelDetail = item.fuelDetail;
      const quantity = item.fuelQuantity;
      const basePrice = fuelDetail.basePriceHyd; // We are using basePriceHyd for all fuel types

      const itemPrice = quantity * basePrice;
      subTotal += itemPrice;
    }
    this.subtotal = subTotal;
    return subTotal.toFixed(2);
  }
  
}
