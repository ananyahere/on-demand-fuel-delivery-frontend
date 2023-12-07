import { Component, Input, OnInit } from '@angular/core';
import { Fuel } from 'src/shared/model/fuel.model';
import { LocalStorageService } from 'src/shared/service/localStorage.service';
import { UserService } from 'src/shared/service/user.service';

@Component({
  selector: 'app-fuel-item',
  templateUrl: './fuel-item.component.html',
  styleUrls: ['./fuel-item.component.css']
})
export class FuelItemComponent implements OnInit{
  @Input() fuel;
  userRole: string;
  userCity: string = 'Hyderabad';

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    // get user role from localStorage
    this.userRole = this.localStorageService.getItem('userRole');
    // Retrieve current user city
    this.userCity = this.userService.getCurrentUserCity();
  }

  getFuelIcon(fuelType: string): string{
    if(fuelType.toLowerCase() === "petrol"){
      return "/assets/images/petrol.png"
    } else if(fuelType.toLowerCase() === "cng"){
      return "/assets/images/cng.png"
    } else if(fuelType.toLowerCase() === "diesel"){
      return "/assets/images/diesel.png"
    } 
    return "/assets/images/petrol.png"
  }

  getFuelPriceForCity(fuel: Fuel): string{
    if(this.userCity.toLowerCase() === "hyderabad") return fuel.basePriceHyd.toString();
    else if(this.userCity.toLowerCase() === "bangalore") return fuel.basePriceBlr.toString();
    else if(this.userCity.toLowerCase() === "bhubaneswar") return fuel.basePriceBhu.toString();
    return "..."
  }
}
