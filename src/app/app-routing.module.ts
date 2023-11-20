import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { OrderComponent } from './order/order.component';
import { CartComponent } from './order/cart/cart.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { SigninMobileComponent } from './auth/signin-mobile/signin-mobile.component';
import { PaymentSuccessComponent } from 'src/shared/component/payment-success/payment-success.component';
import { PageNotFoundComponent } from 'src/shared/component/error/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from 'src/shared/component/error/unauthorized/unauthorized.component';
import { AuthGuard } from 'src/shared/auth/auth.guard';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin-mobile',
    component: SigninMobileComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'profile',

    children: [
      {
        path: ':id',
        component: ProfileComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: EditProfileComponent,
        // canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'orders',
    children: [
      {
        path: '',
        component: OrderComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: ':id',
        component: OrderDetailComponent,
        // canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'cart',
    component: CartComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path: 'something-wrong',
    component: UnauthorizedComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
