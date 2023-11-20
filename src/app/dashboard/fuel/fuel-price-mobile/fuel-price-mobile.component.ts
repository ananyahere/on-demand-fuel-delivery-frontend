import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { IconDefinition, faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuelPriceService } from 'src/shared/service/fuelPrice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fuel-price-mobile',
  templateUrl: './fuel-price-mobile.component.html',
  styleUrls: ['./fuel-price-mobile.component.css']
})
export class FuelPriceMobileComponent implements OnInit, OnDestroy{
  fuelPriceSubscription: Subscription = null;
  fuelPricesList:any = [];
  @Output() closeFuelPrices = new EventEmitter();
  isLoading: boolean = false;

  constructor(
    private fuelPriceService: FuelPriceService,
    private snackbar: MatSnackBar
  ){}

  faTimes: IconDefinition = faTimes;

  ngOnInit(): void {
    this.fuelPricesList = this.fuelPriceService.getFuelPrices()
  }

  public onGetFuelPrices(){
    this.isLoading = true;
    this.fuelPriceSubscription = this.fuelPriceService
    .fetchLatestFuelPrices()
    .subscribe(
      (updatedPrices) => {
        this.fuelPricesList = updatedPrices;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public onClosePopup(){
    this.closeFuelPrices.emit()
  }

  getCitybgImage(city: string): string{
    switch (city){
      case 'Mumbai':
        return 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Mumbai_03-2016_10_skyline_of_Lotus_Colony.jpg';
      case 'Delhi':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/India_Gate_2014-11-01.jpg/1024px-India_Gate_2014-11-01.jpg';
      case 'Bangalore':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Infosys_%284911287704%29.jpg/1920px-Infosys_%284911287704%29.jpg';
      case 'Bhubaneswar':
        return 'https://upload.wikimedia.org/wikipedia/commons/8/83/Lingaraj_temple_Bhubaneswar_11007.jpg';
      case 'Hyderabad':
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Charminar%2C_Hyderabad.JPG/2592px-Charminar%2C_Hyderabad.JPG';
      default:
        return 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Mumbai_03-2016_10_skyline_of_Lotus_Colony.jpg';
    }
  }

  ngOnDestroy(): void {
    if(this.fuelPriceSubscription) this.fuelPriceSubscription.unsubscribe();
  }

}













    // this.fuelPriceService.fetchLatestFuelPrices().subscribe(responses => {
    //   responses.forEach(
    //   res => {
    //       // get information
    //       const cityId = res['cityId'];
    //       const cityName = res['cityName'];
    //       const stateName = res['stateName'];
    //       const pricing = {
    //         petrol: {
    //           price: res['fuel']['petrol']['retailPrice'],
    //           unit: res['fuel']['petrol']['retailUnit'],
    //         },
    //         diesel: {
    //           price: res['fuel']['diesel']['retailPrice'],
    //           unit: res['fuel']['diesel']['retailUnit'],
    //         },
    //         cng: {
    //           price: res['fuel']['cng']['retailPrice'],
    //           unit: res['fuel']['cng']['retailUnit'],
    //         },
    //         lpa: {
    //           price: res['fuel']['lpa']['retailPrice'],
    //           unit: res['fuel']['lpa']['retailUnit'],
    //         },
    //       };
    //       this.fuelPricesList.push({
    //         cityId,
    //         cityName,
    //         stateName,
    //         pricing
    //       })
    //     },
    //   error => {
    //     this.snackbar.open("An error occurred. Please try again later.", "Dismiss", {
    //       duration: 3000, // Snackbar duration in milliseconds
    //       horizontalPosition: 'center', // Position of the snackbar on screen
    //       verticalPosition: 'bottom' // Position of the snackbar on screen
    //     })
    //     console.log(error)
    //     this.fuelPricesList = [
    //       {
    //         cityId: 'mumbai',
    //         cityName: 'Mumbai',
    //         stateName: 'Maharashtra',
    //         pricing: {
    //           petrol: {
    //             price: 98.12,
    //             unit: 'litre',
    //           },
    //           diesel: {
    //             price: 88.19,
    //             unit: 'litre',
    //           },
    //           cng: {
    //             price: 52.17,
    //             unit: 'kg',
    //           },
    //           lpg: {
    //             price: 1509,
    //             unit: '14.2kg',
    //           },
    //         },
    //       },
    //       {
    //         cityId: 'delhi',
    //         cityName: 'Delhi',
    //         stateName: 'Delhi',
    //         pricing: {
    //           petrol: {
    //             price: 96.76,
    //             unit: 'litre',
    //           },
    //           diesel: {
    //             price: 89.66,
    //             unit: 'litre',
    //           },
    //           cng: {
    //             price: 74.59,
    //             unit: 'kg',
    //           },
    //           lpg: {
    //             price: 1053,
    //             unit: '14.2kg',
    //           },
    //         },
    //       },
    //       {
    //         cityId: 'bangalore',
    //         cityName: 'Bangalore',
    //         stateName: 'Karnataka',
    //         pricing: {
    //           petrol: {
    //             price: 104.73,
    //             unit: 'litre',
    //           },
    //           diesel: {
    //             price: 95.38,
    //             unit: 'litre',
    //           },
    //           cng: {
    //             price: 52.17,
    //             unit: 'kg',
    //           },
    //           lpg: {
    //             price: 1400,
    //             unit: '14.2kg',
    //           },
    //         },
    //       },
    //       {
    //         cityId: 'hyderabad',
    //         cityName: 'Hyderabad',
    //         stateName: 'Telangana',
    //         pricing: {
    //           petrol: {
    //             price: 104.58,
    //             unit: 'litre',
    //           },
    //           diesel: {
    //             price: 97.49,
    //             unit: 'litre',
    //           },
    //           cng: {
    //             price: 52.17,
    //             unit: 'kg',
    //           },
    //           lpg: {
    //             price: 1709,
    //             unit: '14.2kg',
    //           },
    //         },
    //       },
    //       {
    //         cityId: 'bhubaneswar',
    //         cityName: 'Bhubaneswar',
    //         stateName: 'Odisha',
    //         pricing: {
    //           petrol: {
    //             price: 98.09,
    //             unit: 'litre',
    //           },
    //           diesel: {
    //             price: 95.94,
    //             unit: 'litre',
    //           },
    //           cng: {
    //             price: 52.17,
    //             unit: 'kg',
    //           },
    //           lpg: {
    //             price: 1513,
    //             unit: '14.2kg',
    //           },
    //         },
    //       }
    //     ]
    //   }
    //   )
    // })