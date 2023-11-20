import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cart } from 'src/shared/model/cart.model';
import { CartService } from 'src/shared/service/cart.service';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { OrderService } from 'src/shared/service/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: Cart = {
    cartId: '654fce913dc4e384200bf21a',
    userId: '654e899a1adc477a43b0b9e7',
    fuelsInCart: null,
    fuelDetailsInCart: [
      {
        fuelItemId: '4691f35b-3e92-4455-8062-b011370c931b',
        fuelTypeId: '654e8c111adc477a43b0b9f2',
        fuelQuantity: 2,
        fuelUnit: null,
        fuelDetail: {
          fuelId: '654e8c111adc477a43b0b9f2',
          fuelType: 'Diesel',
          fuelStock: 450.0,
          fuelStockUnit: 'Litres',
          fuelSuppliers: [
            {
              supplierName: 'Supplier C',
              supplierContactNo: '9999999999',
            },
            {
              supplierName: 'Supplier D',
              supplierContactNo: '8888888888',
            },
          ],
          basePriceHyd: 75.5,
          basePriceBlr: 76.5,
          basePriceBhu: 77.5,
        },
      },
      {
        fuelItemId: 'e23cb6af-d0df-4ae1-962d-5bcde9323c27',
        fuelTypeId: '654e8c1f1adc477a43b0b9f3',
        fuelQuantity: 1,
        fuelUnit: null,
        fuelDetail: {
          fuelId: '654e8c1f1adc477a43b0b9f3',
          fuelType: 'CNG',
          fuelStock: 200.0,
          fuelStockUnit: 'Kgs',
          fuelSuppliers: [
            {
              supplierName: 'Supplier E',
              supplierContactNo: '7777777777',
            },
            {
              supplierName: 'Supplier F',
              supplierContactNo: '6666666666',
            },
          ],
          basePriceHyd: 60.0,
          basePriceBlr: 61.0,
          basePriceBhu: 62.0,
        },
      },
    ],
  };

  constructor(
    private cartService: CartService,
    private localStorageService: LocalStorageService,
    private orderService: OrderService,
    private snackbar: MatSnackBar
  ) {}

  public calculateCartSubTotal(): string {
    let subTotal = 0;

    // Loop over the fuelDetailsInCart array and add up the cost of each fuelDetail
    for (const item of this.cart.fuelDetailsInCart) {
      const fuelDetail = item.fuelDetail;
      const quantity = item.fuelQuantity;
      const basePrice = fuelDetail.basePriceHyd; // We are using basePriceHyd for all fuel types

      const itemPrice = quantity * basePrice;
      subTotal += itemPrice;
    }

    return subTotal.toFixed(2);
  }

  ngOnInit(): void {
    // Retrieve userId from localStorage using the LocalStorageService
    const userId = this.localStorageService.getItem<string>('userId');
    // Fetch cart for the logged-in user
    this.cartService.getCartForUser(userId).subscribe(
      (cart: Cart) => {
        console.log("cart: ", cart)
        this.cart = cart;
      },
      (error) => {
        this.snackbar.open(
          'An error occurred while loading cart. Please try again later.',
          'Dismiss',
          {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom', // Position of the snackbar on screen
          }
        );
      }
    );
  }

  public onRemoveFromCart(fuelItemId: string) {
    const userId = this.localStorageService.getItem('userId').toString();
    this.cartService.removeItemFromCart(userId, fuelItemId).subscribe(
      (response) => {
        this.cart = response;
      },
      (error) => {
        this.snackbar.open(
          'An error occurred while removing item from cart. Please try again later.',
          'Dismiss',
          {
            duration: 3000, // Snackbar duration in milliseconds
            horizontalPosition: 'center', // Position of the snackbar on screen
            verticalPosition: 'bottom', // Position of the snackbar on screen
          }
        );
      }
    );
  }

  public onBuy(fuelItemId: string) {
    // get fuel-item info from cart
    const fuelItem = this.cart['fuelDetailsInCart'].find(
      (item) => item.fuelItemId === fuelItemId
    );
    // add fuel-item to order-summary
    this.orderService.addItemToOrder(
      fuelItemId,
      fuelItem.fuelTypeId,
      fuelItem.fuelQuantity,
      fuelItem.fuelUnit,
      fuelItem.fuelDetail
    );
    // remove fuel-item from cart
    this.onRemoveFromCart(fuelItemId);
  }
}

