import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fuel } from '../model/fuel.model';

@Injectable({
  providedIn: 'root',
})
export class FuelService {
  private BASE_URL_FUEL = 'http://localhost:8080/fuels';

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
  addFuel(fuel: Fuel): Observable<Fuel> {
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
}
