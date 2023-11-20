import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private BASE_URL_PAYMENT = 'http://localhost:8080/payment';
  constructor(private http: HttpClient) {}

  /**
   * Creates a payment link for the given orderId.
   *
   * @param {string} orderId - The ID of the order for which the payment link is to be generated.
   * @returns {Observable<any>} - An Observable that emits the generated payment link on success.
   */
  public createPaymentLink(orderId: string): Observable<any> {
    return this.http.post(
      `${this.BASE_URL_PAYMENT}/${orderId}/paymentLink`,
      ''
    );
  }

  /**
   * Updates the payment detail for the given orderId and paymentId.
   *
   * @param {string} orderId - The ID of the order for which the payment detail is to be updated.
   * @param {string} paymentId - The ID of the payment to be updated.
   * @returns {Observable<any>} - An Observable that emits the updated payment details on success.
   */
  public updatePaymentDetail(orderId: string, paymentIs: string) {
    return this.http.get(
      `${this.BASE_URL_PAYMENT}?payment_id=${orderId}&order_id=${orderId}`
    );
  }

  /**
   * Creates an invoice for the given orderId.
   *
   * @param {string} orderId - The ID of the order for which the invoice is to be generated.
   * @returns {Observable<any>} - An Observable that emits the generated invoice on success.
   */
  public createInvoice(orderId: string): Observable<any> {
    return this.http.post(`${this.BASE_URL_PAYMENT}/${orderId}/invoice`, '');
  }
}
