import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FuelPriceService {
  FUEL_PRICE_API_BASE_URL =
    'https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/fuel-prices/today/india';
  FUEL_PRICE_API_HEADERS = {
    'X-RapidAPI-Key': 'f486212138msh8c449dc587607d0p15b970jsn7794fefa2732',
    'X-RapidAPI-Host':
      'daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com',
  };

  fuelPriceList: any = [
    {
      cityId: 'mumbai',
      cityName: 'Mumbai',
      stateName: 'Maharashtra',
      pricing: {
        petrol: {
          price: 98.12,
          unit: 'litre',
        },
        diesel: {
          price: 88.19,
          unit: 'litre',
        },
        cng: {
          price: 52.17,
          unit: 'kg',
        },
        lpg: {
          price: 1509,
          unit: '14.2kg',
        },
      },
    },
    {
      cityId: 'delhi',
      cityName: 'Delhi',
      stateName: 'Delhi',
      pricing: {
        petrol: {
          price: 96.76,
          unit: 'litre',
        },
        diesel: {
          price: 89.66,
          unit: 'litre',
        },
        cng: {
          price: 74.59,
          unit: 'kg',
        },
        lpg: {
          price: 1053,
          unit: '14.2kg',
        },
      },
    },
    {
      cityId: 'bangalore',
      cityName: 'Bangalore',
      stateName: 'Karnataka',
      pricing: {
        petrol: {
          price: 104.73,
          unit: 'litre',
        },
        diesel: {
          price: 95.38,
          unit: 'litre',
        },
        cng: {
          price: 52.17,
          unit: 'kg',
        },
        lpg: {
          price: 1400,
          unit: '14.2kg',
        },
      },
    },
    {
      cityId: 'hyderabad',
      cityName: 'Hyderabad',
      stateName: 'Telangana',
      pricing: {
        petrol: {
          price: 104.58,
          unit: 'litre',
        },
        diesel: {
          price: 97.49,
          unit: 'litre',
        },
        cng: {
          price: 52.17,
          unit: 'kg',
        },
        lpg: {
          price: 1709,
          unit: '14.2kg',
        },
      },
    },
    {
      cityId: 'bhubaneswar',
      cityName: 'Bhubaneswar',
      stateName: 'Odisha',
      pricing: {
        petrol: {
          price: 98.09,
          unit: 'litre',
        },
        diesel: {
          price: 95.94,
          unit: 'litre',
        },
        cng: {
          price: 52.17,
          unit: 'kg',
        },
        lpg: {
          price: 1513,
          unit: '14.2kg',
        },
      },
    },
  ];

  public getFuelPrices() {
    return this.fuelPriceList;
  }

  /**
    A public method that returns latest fuel pricing via an Observable.
    @returns {Observable} - An Observable of the latest fuel pricing updates 
  */
  public fetchLatestFuelPrices() {
    return new Observable((observer) => {
      setTimeout(() => {
        const updatedPrices = this.updateFuelPricing(this.fuelPriceList);
        observer.next(updatedPrices);
        observer.complete();
      }, 3000);
    });
  }

  /**
    A private method that updates the fuel pricing for cities.
    @param {Array} prices - An array of city pricing objects
    @returns {Array} - An updated array of city pricing objects 
  */
  private updateFuelPricing(prices) {
    const updatedPrices = prices.map((city) => {
      Object.keys(city.pricing).forEach((fuelType) => {
        const price = city.pricing[fuelType].price;
        const priceDifference = Math.floor(Math.random() * 5) + 1;
        const priceChange =
          Math.random() < 0.5 ? -priceDifference : priceDifference;
        city.pricing[fuelType].price = price + priceChange;
      });
      return city;
    });
    return updatedPrices;
  }
}
