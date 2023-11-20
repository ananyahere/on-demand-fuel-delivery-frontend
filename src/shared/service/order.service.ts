import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../model/order.model';
import { FuelDetail, FuelItem, FuelItemDetail } from '../model/fuel.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private BASE_URL_ORDER = 'http://localhost:8080/orders';
  currentOrder: Order = {
    orderId: null,
    userId: null,
    deliveryLoc: null,
    deliveryOtp: null,
    orderStatus: null,
    totalAmount: null,
    orderTime: null,
    scheduledTime: null,
    orderItems: null,
    orderItemsWithDetails: null,
    immediate: null,
  };
  orderUpdated = new BehaviorSubject<Order>({
    orderId: null,
    userId: null,
    deliveryLoc: null,
    deliveryOtp: null,
    orderStatus: null,
    totalAmount: null,
    orderTime: null,
    scheduledTime: null,
    orderItems: null,
    orderItemsWithDetails: null,
    immediate: null,
  }); // create a new BehaviorSubject

  constructor(private http: HttpClient) {}

  /**
   * Places a new order
   * @param order The order object to be placed
   * @returns An observable of the placed order
   */
  placeOrder(order): Observable<any> {
    return this.http.post<any>(this.BASE_URL_ORDER + '/place', order);
  }

  /**
   * Retrieves the order history of a specific user
   * @param userId The ID of the user whose order history is to be retrieved
   * @returns An observable of the list of orders constituting the user's order history
   */
  getOrderHistoryOfUser(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(this.BASE_URL_ORDER + `/history/${userId}`);
  }

  /**
   * Retrieves order details by ID
   * @param orderId The ID of the order whose details are to be retrieved
   * @returns An observable of the order object containing the details of the requested order
   */
  getOrderDetailsById(orderId: string): Observable<Order> {
    return this.http.get<Order>(this.BASE_URL_ORDER + `/${orderId}`);
  }

  /**
   * Add a fuel item to the current order.
   * Also updates the orderItemsWithDetails array with the details of the fuel item.
   * Emits the updated order via the orderUpdated BehaviorSubject.
   * @param fuelItemId The ID of the fuel item to be added to the order.
   * @param fuelTypeId The ID of the fuel type associated with the fuel item.
   * @param fuelQuantity The quantity of fuel in the fuel item.
   * @param fuelUnit The unit in which fuel quantity is measured.
   * @param fuelDetail The detailed information about the fuel.
   * @returns The updated order object after the fuel item is added to it.
   */
  addItemToOrder(
    fuelItemId: string,
    fuelTypeId: string,
    fuelQuantity: number,
    fuelUnit: string = 'Liters',
    fuelDetail: FuelDetail
  ): Order {
    // create a fuelItem
    const fuelItem: FuelItem = {
      fuelItemId,
      fuelTypeId,
      fuelQuantity,
      fuelUnit,
    };
    // create a fuelItemDetail
    const fuelItemDetail: FuelItemDetail = {
      fuelItemId,
      fuelTypeId,
      fuelQuantity,
      fuelUnit,
      fuelDetail,
    };
    // add fuelItem to order
    if (this.currentOrder['orderItems'] == null)
      this.currentOrder['orderItems'] = [fuelItem];
    else this.currentOrder['orderItems'].push(fuelItem);
    if (this.currentOrder['orderItemsWithDetails'] == null)
      this.currentOrder['orderItemsWithDetails'] = [fuelItemDetail];
    else this.currentOrder['orderItemsWithDetails'].push(fuelItemDetail);
    // emit the updated order using the BehaviorSubject
    this.orderUpdated.next(this.currentOrder);
    return this.currentOrder;
  }

  /**
   * Remove a fuel item and its details with the specified fuel item ID from the current order.
   * Emits the updated order via the orderUpdated BehaviorSubject.
   * @param fuelItemIdToRemove The ID of the fuel item to be removed from the order.
   * @returns The updated order object after the fuel item is removed from it.
   */
  removeItemFromOrder(fuelItemIdToRemove: string): Order {
    console.log(this.currentOrder);
    // remove fuelItem
    this.currentOrder['orderItems'] = this.currentOrder['orderItems'].filter(
      (item) => item.fuelItemId !== fuelItemIdToRemove
    );
    // remove fuelItemDetail
    this.currentOrder['orderItemsWithDetails'] = this.currentOrder[
      'orderItemsWithDetails'
    ].filter((item) => item.fuelItemId !== fuelItemIdToRemove);
    // emit the updated order using the BehaviorSubject
    this.orderUpdated.next(this.currentOrder);
    return this.currentOrder;
  }

  /**
   * Update a specific key-value pair in the current order object.
   * Emits the updated order via the orderUpdated BehaviorSubject.
   * @param key The key of the order object to be updated.
   * @param value The new value of the key to be set.
   * @returns The updated order object after the specified key-value pair is updated.
   */
  updateOrderDetails(key: string, value) {
    this.currentOrder[key] = value;
    // emit the updated order using the BehaviorSubject
    this.orderUpdated.next(this.currentOrder);
    return this.currentOrder;
  }

  /**
   * Retrieves the order history of a specific user
   * @returns An observable of the list of orders constituting order history
   */
  getOrderHistory(): Observable<Order[]> {
    return this.http.get<Order[]>(this.BASE_URL_ORDER);
  }

  /**
  * A public method that updates the status of an order with the provided orderId
  * using an HTTP POST request to the Order API.
  * @param {string} orderId - The ID of the order to be updated
  * @param {string} status - The new status of the order
  * @returns {Observable} - An Observable of the updated order status 
  */
  public updateOrderStatus(orderId: string, status: string) {
    return this.http.post<any>(`${this.BASE_URL_ORDER}/${orderId}/status`, {
      status: status,
    });
  }

  /**
  * A public method that retrieves the delivery OTP for an order with the provided orderId
  * using an HTTP GET request to the Order API.
  * @param {string} orderId - The ID of the order to retrieve the OTP for
  * @returns {Observable} - An Observable of the delivery OTP for the provided order ID 
  */
  getDeliveryOTP(orderId: string) {
    return this.http.get<any>(`${this.BASE_URL_ORDER}/${orderId}/otp`)
  }

  verifyDeliveryOTP() {}
}


















// {
//   orderId: '654fcdd23dc4e384200bf20f',
//   userId: '654e899a1adc477a43b0b9e7',
//   deliveryLoc: {
//     addressId: 'A001',
//     type: 'Home',
//     receiver: 'John Doe',
//     location: '123 Main St, Anytown, CA 12345',
//   },
//   orderStatus: 'Pending',
//   totalAmount: 50.99,
//   orderTime: '2022-10-01T04:30:00.000+00:00',
//   scheduledTime: null,
//   orderItems: [
//     {
//       fuelItemId: 'FI001',
//       fuelTypeId: '654e8bf71adc477a43b0b9f1',
//       fuelQuantity: 10,
//       fuelUnit: 'Liters',
//     },
//   ],
//   orderItemsWithDetails: [
//     {
//       fuelItemId: 'FI001',
//       fuelTypeId: '654e8bf71adc477a43b0b9f1',
//       fuelQuantity: 10,
//       fuelUnit: 'Liters',
//       fuelDetail: {
//         fuelId: '654e8bf71adc477a43b0b9f1',
//         fuelType: 'Petrol',
//         fuelStock: 350,
//         fuelStockUnit: 'Litres',
//         fuelSuppliers: [
//           {
//             supplierName: 'Supplier A',
//             supplierContactNo: '9876543210',
//           },
//           {
//             supplierName: 'Supplier B',
//             supplierContactNo: '1234567890',
//           },
//         ],
//         basePriceHyd: 85,
//         basePriceBlr: 86,
//         basePriceBhu: 87,
//       },
//     },
//   ],
//   immediate: true,
// }
