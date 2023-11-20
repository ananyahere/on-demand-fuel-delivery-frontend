import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(
    private http: HttpClient) {}

    private GEO_API_URL =
    "https://api.geoapify.com/v1/geocode/reverse";

  /**
    A public method that uses the Geolocation API to get the user's location.
    @returns {Observable} - An Observable of the user's current location 
  */
  public getUserLocation(): Observable<any> {
    if (navigator.geolocation) {
      // Use the Geolocation API to get the user's location
      return new Observable((observer) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('getUserLocation:', position);
            observer.next(position);
            observer.complete();
          },
          (error) => {
            console.log(error)
            observer.error(error);
          }
        );
      }).pipe(
        catchError((error) => {
          console.log(error)
          return throwError(error.message);
        })
      );
    } else {
      console.log('Geolocation is not supported by this browser.')
      return throwError('Geolocation is not supported by this browser.');
    }
  }

  /**
    A public method that retrieves the city associated with the given latitude and longitude
    using an HTTP GET request to a Geo API.
    @param {number} latitude - The latitude of the location
    @param {number} longitude - The longitude of the location
    @returns {Observable} - An Observable of the city associated with the provided latitude and longitude 
  */
  public getCity(latitude: number, longitude: number): Observable<any>{
    return this.http.get<any>(`${this.GEO_API_URL}?lat=${latitude}&lon=${longitude}&format=json&apiKey=80c56e4b58a14bbe9a56883dc42474a8`)
    .pipe(

        catchError((error: HttpErrorResponse) => {
            return throwError("Something went wrong; please try again later.");
        })
    )
  }

  /**
    A public method that uses the getUserLocation and getCity methods to get the user's location
    and their city via an Observable.
    @returns {Observable} - An Observable of the user's location and associated city 
  */
  public getLocationAndCity(): Observable<any> {
    // Use the getUserLocation and getCity methods to get the user's location and their city
    return new Observable((observer) => {
      this.getUserLocation().subscribe(
        (position: any) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.getCity(latitude, longitude).subscribe(
            (city: any) => {
              observer.next({
                latitude: latitude,
                longitude: longitude,
                city: city,
              });
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
