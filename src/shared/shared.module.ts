import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FuelDetailDialogComponent } from './component/fuel-detail-dialog/fuel-detail-dialog.component';
import { PageNotFoundComponent } from './component/error/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './component/error/unauthorized/unauthorized.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomSnackbarComponent } from './component/custom-snackbar/custom-snackbar.component';
import { MaterialModule } from 'src/material/material.module';
import { LoaderComponent } from './component/loader/loader.component';
import { PlaceOrderDialogComponent } from './component/place-order-dialog/place-order-dialog.component';
import { LinkDialogComponent } from './component/link-dialog/link-dialog.component';
import { PaymentSuccessComponent } from './component/payment-success/payment-success.component';
import { UpdateStatusDialogComponent } from './component/update-status-dialog/update-status-dialog.component';
import { RouterModule } from '@angular/router';
import { EditAddressDialogComponent } from './component/edit-address-dialog/edit-address-dialog.component';
import { OrderDetailsEmailWriteupComponent } from './component/order-details-email-writeup/order-details-email-writeup.component';

@NgModule({
  declarations: [
    FuelDetailDialogComponent,
    PageNotFoundComponent,
    UnauthorizedComponent,
    CustomSnackbarComponent,
    LoaderComponent,
    PlaceOrderDialogComponent,
    LinkDialogComponent,
    PaymentSuccessComponent,
    UpdateStatusDialogComponent,
    EditAddressDialogComponent,
    OrderDetailsEmailWriteupComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [LoaderComponent],
})
export class SharedModule {}
