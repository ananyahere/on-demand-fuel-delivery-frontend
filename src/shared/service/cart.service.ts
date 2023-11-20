import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject ,Observable } from 'rxjs';
import { Cart } from '../model/cart.model';
import { FuelItem } from '../model/fuel.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private BASE_URL_CART = 'http://localhost:8080/cart';
  private cart: Cart;
  private cartChangeSubject: BehaviorSubject<Cart[]> = new BehaviorSubject<Cart[]>([]);
  cartChange$: Observable<Cart[]> = this.cartChangeSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the cart for a specific user
   * @param userId The ID of the user whose cart is to be retrieved
   * @returns An observable of the cart object for the user
   */
  getCartForUser(userId: string): Observable<Cart> {
    return this.http.get<Cart>(this.BASE_URL_CART + `/${userId}`);
  }

  /**
   * Adds a fuel item to the user's cart
   * @param userId The ID of the user whose cart the item is to be added to
   * @param fuelItem The fuel item object to be added to the user's cart
   * @returns An observable of the updated cart object for the user
   */
  addItemToCart(userId: string, fuelItem: FuelItem): Observable<Cart> {
    return this.http.post<Cart>(this.BASE_URL_CART + `/${userId}`, fuelItem)
  }

  /**
   * Removes a fuel item from the user's cart
   * @param userId The ID of the user whose cart the item is to be removed from
   * @param fuelItemId The ID of the fuel item to be removed from the user's cart
   * @returns An observable of the updated cart object for the user
   */
  removeItemFromCart(userId: string, fuelItemId: string): Observable<Cart> {
    return this.http.delete<Cart>(this.BASE_URL_CART + `/${userId}/${fuelItemId}`)
  }

  /**
   * Clears the user's cart
   * @param userId The ID of the user whose cart is to be cleared
   * @returns An observable of the empty cart object for the user
   */
  clearCart(userId: string): Observable<Cart> {
    return this.http.delete<Cart>(this.BASE_URL_CART + `/${userId}`)
    // .pipe(
    //   map(response => {
    //     this.cart = response;
    //     this.emitCartChange()
    //     return true;
    //   })
    // );
  }

  private emitCartChange(): void {
    this.cartChangeSubject.next([this.cart]);
  }
}
