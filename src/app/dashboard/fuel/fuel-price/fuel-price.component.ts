import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuelPriceService } from 'src/shared/service/fuelPrice.service';
import { Subscription } from 'rxjs';
import { IconDefinition, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-fuel-price',
  templateUrl: './fuel-price.component.html',
  styleUrls: ['./fuel-price.component.css'],
})
export class FuelPriceComponent implements OnInit, OnDestroy {
  faSpinner: IconDefinition = faSpinner;
  fuelPriceSubscription: Subscription = null;
  fuelPricesList: any = [];
  isLoading: boolean = false;

  constructor(
    private fuelPriceService: FuelPriceService
  ) {}

  ngOnInit(): void {
    this.fuelPricesList = this.fuelPriceService.getFuelPrices();
  }

  onGetFuelPrices() {
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
