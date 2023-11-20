import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/shared/service/order.service';
import { PaymentService } from 'src/shared/service/payment.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit{
  private order_id;
  private payment_id;

  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
    private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.order_id = params["order_id"]
      this.payment_id = params["payment_id"]
      console.log(this.order_id)
      console.log(this.payment_id)
    })
    // get order details 
    // update payment details
    this.paymentService.updatePaymentDetail(this.order_id, this.payment_id).subscribe(
      res => {
        console.log(res)
      },
      error => {
        // ..
      }
    )
  }

}
