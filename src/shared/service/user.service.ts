import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Address, User, Vehicle } from '../model/user.model';
import { LocalStorageService } from './localStorage.service';
import { generateUUID } from 'src/shared/utils/helper';

@Injectable({ providedIn: 'root' })
export class UserService {
  private BASE_URL_USER = 'https://tankontap.up.railway.app/users';
  private currentUserLoc: Address = {
    addressId: "A0xvhg1",
    type: 'Current-82p',
    receiver: 'Jane Smith',
    location: "T-hub 2.0, T hub 2.0, Inorbit Mall Road, Madhapur, Hyderabad - 500032, TG, India",
    phone: '9876543210',
    city: "Hyderabad"
  };
  // private currentUserCity: string = 'Hyderabad';
  currentUserCitySubject = new BehaviorSubject<string>("Hyderabad");
  currentUserCity$: Observable<string> = this.currentUserCitySubject.asObservable();

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

  public editAddress(userId: string, addressId: string, address): Observable<User> {
    return this.http.put<User>(
      this.BASE_URL_USER + `/${userId}/addresses/${addressId}`,
      address
    )
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
    return this.http.post<any>(`https://tankontap.up.railway.app/city?user_id=${userId}`, {
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
   * Gets the rate of a city.
   * @param city - A string representing the city whose rate is to be retrieved.
   * @returns A number representing the rate of the city.
   */
  public getCityRate(city: string) {
    switch (city) {
      case 'Hyderabad':
        return 5;
      case 'Bangalore':
        return 8;
      case 'Bhubaneswar':
        return 7;
      default:
        return 20;
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

  public setCurrentUserLoc(address: Address): void {
    this.currentUserLoc = address;
    console.log("currentUserLoc: ", this.currentUserLoc)
    // update user loc in local storage
    this.localStorageService.setItem('userLoc', address.location)
  }

  public getCurrentUserLoc(): Address {
    return this.currentUserLoc;
  }

  public setCurrentUserCity(city: string): void {
    // emit the updated city
    this.currentUserCitySubject.next(city)
    // update user city in local storage
    this.localStorageService.setItem('userCity', city)

  }

  public getCurrentUserCityChange(): Observable<string> {
    return this.currentUserCity$;
  }

  public getCurrentUserCity(): string {
    const userCity: string = this.localStorageService.getItem('userCity');
    return userCity;
    
  }

  public getCityDeliveryRate(city: string) {
    switch (city) {
      case 'Hyderabad':
        return 1;
      case 'Bangalore':
        return 3;
      case 'Bhubaneswar':
        return 5;
      default:
        return 7;
    }
  }
}
