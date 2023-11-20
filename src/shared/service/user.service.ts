import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address, User, Vehicle } from '../model/user.model';
import { LocalStorageService } from './localStorage.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private BASE_URL_USER = 'http://localhost:8080/users';
  userLoc: string = 'hyd';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  /**
   * Retrieves all users
   * @returns An observable of the list of all user objects
   */
  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.BASE_URL_USER);
  }

  /**
   * Retrieves a single user by ID
   * @param userId The ID of the user to be retrieved
   * @returns An observable of the requested user object
   */
  public getUserById(userId: string): Observable<User> {
    return this.http.get<User>(this.BASE_URL_USER + `/${userId}`);
  }

  /**
   * Retrieves all addresses of a user
   * @param userId The ID of the user whose addresses are to be retrieved
   * @returns An observable of the list of all address objects for the user
   */
  public getAddresses(userId: string): Observable<Address[]> {
    return this.http.get<Address[]>(
      this.BASE_URL_USER + `/${userId}/addresses`
    );
  }

  /**
   * Retrieves a single address of a user by ID
   * @param userId The ID of the user whose address is to be retrieved
   * @param addressId The ID of the address to be retrieved
   * @returns An observable of the requested address object
   */
  public getAddressById(userId: string, addressId: string): Observable<User> {
    return this.http.get<User>(
      this.BASE_URL_USER + `/${userId}/addresses/${addressId}`
    );
  }

  /**
   * Saves a new or existing address for a user
   * @param userId The ID of the user whose address is to be saved
   * @param address The address object to be saved
   * @returns An observable of the updated user object
   */
  public saveAddress(userId: string, address: Address): Observable<User> {
    return this.http.post<User>(
      this.BASE_URL_USER + `/${userId}/addresses`,
      address
    );
  }

  /**
   * Retrieves all vehicles of a user
   * @param userId The ID of the user whose vehicles are to be retrieved
   * @returns An observable of the list of all vehicle objects for the user
   */
  public getVehicles(userId: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.BASE_URL_USER + `/${userId}/vehicles`);
  }

  /**
   * Retrieves a single vehicle of a user by ID
   * @param userId The ID of the user whose vehicle is to be retrieved
   * @param vehicleId The ID of the vehicle to be retrieved
   * @returns An observable of the requested vehicle object
   */
  public getVehicleById(userId: string, vehicleId: string): Observable<User> {
    return this.http.get<User>(
      this.BASE_URL_USER + `/${userId}/vehicles/${vehicleId}`
    );
  }

  /**
   * Saves a new or existing vehicle for a user
   * @param userId The ID of the user whose vehicle is to be saved
   * @param vehicle The vehicle object to be saved
   * @returns An observable of the updated user object
   */
  public saveVehicle(userId: string, vehicle: Vehicle): Observable<User> {
    return this.http.post<User>(
      this.BASE_URL_USER + `/${userId}/vehicles`,
      vehicle
    );
  }

  /**
   * Updates an existing user by ID
   * @param userId The ID of the user to be updated
   * @param userDetails An object containg the user details to be updated
   * @returns An observable of the updated user object
   */
  public updateUser(userId: string, userDetails): Observable<User> {
    return this.http.put<User>(this.BASE_URL_USER + `/${userId}`, userDetails);
  }

  /**
   * Deletes an existing user by ID
   * @param userId The ID of the user to be deleted
   * @returns An observable of the deleted user object
   */
  public deleteUser(userId: string): Observable<User> {
    return this.http.delete<User>(this.BASE_URL_USER + `/${userId}`);
  }

  /**
   * Sets the user's location in the server.
   * @param userId The ID of the user to update.
   * @param location The location to set for the user.
   * @returns An Observable that emits the HTTP response from the server.
   */
  public setUserLocation(userId: string, location: string) {
    return this.http.post<any>(`http://localhost:8080/city?user_id=${userId}`, {
      city: location,
    });
  }

  /**
   * Sets the user's location in the server.
   * @param userId The ID of the user to update.
   * @param name The name to set for the user.
   * @returns An Observable that emits the HTTP response from the server.
   */
  public setUserName(userId: string, name: string) {
    return this.http.put<any>(`${this.BASE_URL_USER}/${userId}/name`, {
      name: name,
    });
  }

  /**
   * Gets the location of the user.
   * @returns A string representing the location of the user.
   */
  public getUserLocation() {
    return this.userLoc;
  }

  /**
   * Gets an array of cities.
   * @returns An array of cities.
   */
  public getCities() {
    return ['Hyderabad', 'Bangalore', 'Bhubaneswar', 'Others'];
  }

  /**
   * Gets the rate of a city.
   * @param city - A string representing the city whose rate is to be retrieved.
   * @returns A number representing the rate of the city.
   */
  public getCityRate(city) {
    switch (city) {
      case 'Hyderabad':
        return 20;
      case 'Bangalore':
        return 30;
      case 'Bhubaneswar':
        return 40;
      default:
        return 100;
    }
  }

  /**
   * Determines if the user is an admin.
   * @returns A boolean value indicating whether or not the user is an admin.
   */
  public isAdmin(): boolean {
    return this.localStorageService.getItem('userRole') == 'admin';
  }

  /**
   * Determines if the user is a standard user.
   * @returns A boolean value indicating whether or not the user is a standard user.
   */
  public isUser(): boolean {
    return this.localStorageService.getItem('userRole') == 'user';
  }
}
