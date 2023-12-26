import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fuel } from '../model/fuel.model';

@Injectable({
  providedIn: 'root',
})
export class FuelService {
  private BASE_URL_FUEL = 'https://tankontap.up.railway.app/fuels';
  private warehouses = [
    {
      location: "Devender Colony, Kompally, Hyderabad, Telangana",
      city: "Hyderabad"
    },
    {
      location: "Doddanekkundi Industrial Area Rd, Ferns Paradise, Doddanekkundi, Bengaluru, Karnataka",
      city: "Bangalore"
    },
    {
      location: "Ranipur Industrial Area, Khurda, Bhubaneswar, Orissa",
      city: "Bhubaneswar"
    }
  ]

  constructor(private http: HttpClient) {}

  /**
   * Get all fuels
   * @returns Observable of Fuel[]
   */
  getAllFuels(): Observable<Fuel[]> {
    return this.http.get<Fuel[]>(this.BASE_URL_FUEL);
  }

  /**
   * Get fuel by ID
   * @param fuelId ID of the fuel to retrieve
   * @returns Observable of Fuel
   */
  getFuelById(fuelId: string): Observable<Fuel> {
    const url = `${this.BASE_URL_FUEL}/${fuelId}`;
    return this.http.get<Fuel>(url);
  }

  /**
   * Add a new fuel
   * @param fuel Object representing the Fuel to add
   * @returns Observable of Fuel representing the added fuel with ID
   */
  addFuel(fuel): Observable<any> {
    return this.http.post<Fuel>(this.BASE_URL_FUEL, fuel);
  }

  /**
   * Delete fuel by ID
   * @param fuelId ID of the fuel to delete
   * @returns Observable that completes once the fuel is deleted
   */
  deleteFuelById(fuelId: string): Observable<any> {
    const url = `${this.BASE_URL_FUEL}/${fuelId}`;
    return this.http.delete(url);
  }

  /**
   * Search fuels by type
   * @param fuelType String representing fuel type to search for
   * @returns Observable of Fuel[] representing matching fuels (or empty if not found)
   */
  searchFuelByType(fuelType: string): Observable<Fuel[]> {
    const url = `${this.BASE_URL_FUEL}/search`;
    const options = {
      params: new HttpParams().set('fuelType', fuelType),
    };
    return this.http.get<Fuel[]>(url, options);
  }

  getWarehouses(){
    return this.warehouses
  }

  /**
   * Gets an array of cities.
   * @returns An array of cities.
   */
  public getWarehouseCities(): string[] {
    return ['Hyderabad', 'Bangalore', 'Bhubaneswar'];
  }

}
