import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroComponent } from './home/hero/hero.component';
import { FeaturesComponent } from './home/features/features.component';
import { SharedModule } from 'src/shared/shared.module';
import { AuthService } from 'src/shared/service/auth.service';
import { HeaderComponent } from './home/header/header.component';
import { FuelPriceComponent } from './dashboard/fuel/fuel-price/fuel-price.component';
import { FuelPriceMobileComponent } from './dashboard/fuel/fuel-price-mobile/fuel-price-mobile.component';
import { FuelItemComponent } from './dashboard/fuel/fuel-item/fuel-item.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material/material.module';
import { FuelDetailComponent } from './dashboard/fuel/fuel-detail/fuel-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { CartComponent } from './order/cart/cart.component';
import { SigninMobileComponent } from './auth/signin-mobile/signin-mobile.component';
import { OrderSummaryComponent } from './order/order-summary/order-summary.component';
import { AuthInterceptor } from 'src/shared/auth/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // imports firebase/auth, only needed for auth features
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // imports firebase/firestore, only needed for database features
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyCeDHrtOE3IryPqbQZsi6KYNMJK0p6D8yE",
  authDomain: "auth-ph-num-email-pass.firebaseapp.com",
  databaseURL: "https://auth-ph-num-email-pass-default-rtdb.firebaseio.com",
  projectId: "auth-ph-num-email-pass",
  storageBucket: "auth-ph-num-email-pass.appspot.com",
  messagingSenderId: "711199989114",
  appId: "1:711199989114:web:059d3cdcdcf27825ec8ac3"
};

firebase.initializeApp(firebaseConfig)

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    NavbarComponent,
    DashboardComponent,
    HomeComponent,
    HeroComponent,
    FeaturesComponent,
    HeaderComponent,
    FuelPriceComponent,
    FuelPriceMobileComponent,
    FuelItemComponent,
    FuelDetailComponent,
    ProfileComponent,
    EditProfileComponent,
    OrderComponent,
    OrderDetailComponent,
    CartComponent,
    SigninMobileComponent,
    OrderSummaryComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    SharedModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
