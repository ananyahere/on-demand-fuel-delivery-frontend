import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconDefinition, faBars } from '@fortawesome/free-solid-svg-icons';
import { forkJoin } from 'rxjs';
import { FuelDetailDialogComponent } from 'src/shared/component/fuel-detail-dialog/fuel-detail-dialog.component';
import { Fuel } from 'src/shared/model/fuel.model';
import { FuelService } from 'src/shared/service/fuel.service';
import { delay } from 'rxjs/operators';
import { FuelPriceService } from 'src/shared/service/fuelPrice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isFuelPricePopup: boolean = false;
  faBars: IconDefinition = faBars;
  isLatestPriceLoading: boolean = false;
  fuelPrices = {};
  fuelPricesList = [];
  fuelList: Fuel[] = [];
  isFuelListLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private fuelDetailDialog: MatDialog,
    private fuelService: FuelService,
    private snackbar: MatSnackBar,
    private fuelPriceService: FuelPriceService
    // private locationService: LocationService
  ) {}

  ngOnInit(): void{
    this.isFuelListLoading = true
    this.fuelService.getAllFuels()
    .pipe(delay(2000))
    .subscribe(
      response => {
        this.fuelList = response
        this.isFuelListLoading = false
      },
      error => {
        this.snackbar.open("An error occurred. Please try again later.", "Dismiss", {
          duration: 3000, // Snackbar duration in milliseconds
          horizontalPosition: 'center', // Position of the snackbar on screen
          verticalPosition: 'bottom' // Position of the snackbar on screen
        })
        this.isFuelListLoading = false
      }
    )

    // this.locationService.getLocationAndCity().subscribe(data => {
    //   const latitude = data.latitude;
    //   const longitude = data.longitude;
    //   const city = data.city;
    //   console.log(`Latitude: ${latitude}`);
    //   console.log(`Longitude: ${longitude}`);
    //   console.log(`City: ${city}`);
    // })

  }

  public toggleFuelPrices(){
    this.isFuelPricePopup = !this.isFuelPricePopup
  }

  public openFuelDetailDialog(fuelDetails){
    this.fuelDetailDialog.open(FuelDetailDialogComponent, {
      data: { fuelDetails }
    })
  }

}

// ngOnInit(): void {
//   // Fuel price in Mumbai
//   this.isLoadingMum = true;
//   this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/maharashtra/mumbai`, {
//     headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//   }).subscribe(
//     (response) => {
//       console.log(response)
//       this.isLoadingMum = false;

//       // Fuel price in Delhi
//       this.isLoadingDel = true;
//       this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/delhi/delhi`, {
//         headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//       }).subscribe(
//         (response) => {
//           console.log(response)
//           this.isLoadingDel = false;

//           // Fuel price in Bangalore
//           this.isLoadingBang = true;
//           this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/karnataka/bangalore`, {
//             headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//           }).subscribe(
//             (response) => {
//               console.log(response)
//               this.isLoadingBang = false;

//               // Fuel price in Hydrabad
//               this.isLoadingHyd = true;
//               this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/telangana/hyderabad`, {
//                 headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//               }).subscribe(
//                 (response) => {
//                   console.log(response)
//                   this.isLoadingHyd = false;

//                   // Fuel price in Bhubaneswar
//                   this.isLoadingBhu = true;
//                   this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/odisha/bhubaneswar`, {
//                     headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//                   }).subscribe(
//                     (response) => {
//                       console.log(response)
//                       this.isLoadingBhu = false;
//                     }
//                   )

//                 }
//               )
//             }
//           )

//         }
//       )

//     }
//   )
//   // // Fuel price in Delhi
//   // this.isLoadingDel = true;
//   // this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/delhi/delhi`, {
//   //   headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//   // }).subscribe(
//   //   (response) => {
//   //     console.log(response)
//   //     this.isLoadingDel = false;
//   //   }
//   // )

//   // Fuel price in Bangalore
//   // this.isLoadingBang = true;
//   // this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/karnataka/bangalore`, {
//   //   headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//   // }).subscribe(
//   //   (response) => {
//   //     console.log(response)
//   //     this.isLoadingBang = false;
//   //   }
//   // )

//   // // Fuel price in Hyderabad
//   // this.isLoadingHyd = true;
//   // this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/telangana/hyderabad`, {
//   //   headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//   // }).subscribe(
//   //   (response) => {
//   //     console.log(response)
//   //     this.isLoadingHyd = false;
//   //   }
//   // )

//   // // Fuel price in Bhubaneswar
//   // this.isLoadingBhu = true;
//   // this.http.get<any>(`${this.FUEL_PRICE_API_BASE_URL}/odisha/bhubaneswar`, {
//   //   headers: new HttpHeaders(this.FUEL_PRICE_API_HEADERS)
//   // }).subscribe(
//   //   (response) => {
//   //     console.log(response)
//   //     this.isLoadingBhu = false;
//   //   }
//   // )

// }
