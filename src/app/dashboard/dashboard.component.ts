import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuelDetailDialogComponent } from 'src/shared/component/fuel-detail-dialog/fuel-detail-dialog.component';
import { Fuel, FuelDetail } from 'src/shared/model/fuel.model';
import { FuelService } from 'src/shared/service/fuel.service';
import { delay } from 'rxjs/operators';
import { UserService } from 'src/shared/service/user.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isLatestPriceLoading: boolean = false;
  fuelPrices = {};
  fuelPricesList = [];
  allFuelList: Fuel[] = [];
  fuelList: Fuel[] = [];  // fuelList filtered on the basis of selected-city
  fuelListForCity: Fuel[] = [];
  isFuelListLoading: boolean = true;
  userCity: string = 'Hyderabad';
  isUserCityOther: boolean = false;
  showPriceFilter: boolean = false;
  showAmountFilter: boolean = false;
  showSupplierFilter: boolean = false;
  showTypeFilter: boolean = false;
  fuelTypeList: string[] = []
  fuelSupplierList: string[] = []
  fuelTypeFilterForm: FormGroup;
  fuelSupplierFilterForm: FormGroup;

  constructor(
    private fuelDetailDialog: MatDialog,
    private fuelService: FuelService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private userService: UserService
  ) {
    this.fuelTypeFilterForm = this.fb.group({
      fuelTypes: new FormArray([])
    })
    this.fuelSupplierFilterForm = this.fb.group({
      fuelSuppliers: new FormArray([])
    })
  }

  ngOnInit(): void{
    this.isFuelListLoading = true
    
    this.fuelService.getAllFuels()
    .pipe(delay(2000))
    .subscribe(
      response => {
        this.fuelList = response
        this.fuelListForCity = response
        this.allFuelList = response
        // set fuelTypeList and fuelSupplierList
        this.getFuelTypeList()
        this.getFuelSuppliers()
        // add checkboxes to filters
        this.addFuelSupplierCheckbox()
        this.addFuelTypeCheckbox()
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

    // Retrieve current user city
    this.userCity = this.userService.getCurrentUserCity();
    this.userService.getCurrentUserCityChange().subscribe(newUserCity => {
      this.userCity = newUserCity
      this.isUserCityOther = false;
      // apply city based filter
      this.applyCityFilter(newUserCity)
    })

    // filter data with every change in type
    this.fuelTypeFilterForm.valueChanges.subscribe(value => {
      let selectedFuelTypes: string[] = []
      // get selected fuel-types
      value.fuelTypes.forEach((v: boolean, i) => {
        if(v) selectedFuelTypes.push(this.fuelTypeList[i])
      })
      if(selectedFuelTypes.includes('All')) {
        this.fuelList = this.fuelListForCity
        return
      };
      const filteredFuels = this.fuelListForCity.filter(fuel => selectedFuelTypes.includes(fuel.fuelType))
      this.fuelList = filteredFuels
    })

    // filter data with every change in supplier
    this.fuelSupplierFilterForm.valueChanges.subscribe(value => {
      let selectedSuppliers: string[] = []
      value.fuelSuppliers.forEach((v: boolean, i) => {
        if(v) selectedSuppliers.push(this.fuelSupplierList[i])
      })
      if(selectedSuppliers.includes('All')) {
        this.fuelList = this.fuelListForCity
        return
      };
      const filteredFuels = this.fuelListForCity.filter(fuel => selectedSuppliers.includes(fuel.fuelSupplier?.name))
      this.fuelList = filteredFuels
    })
  }

  // Opens a dialog window to display the fuel details for a particular fuel type.
  public openFuelDetailDialog(fuelDetails: FuelDetail){
    this.fuelDetailDialog.open(FuelDetailDialogComponent, {
      data: { fuelDetails }
    })
  }

  applyCityFilter(city: string): void{
    if(!this.fuelService.getWarehouseCities().includes(city)) this.isUserCityOther = true
    switch(city.toLowerCase()){
      case 'hyderabad':
        this.fuelList = this.allFuelList.filter(obj => obj.hasOwnProperty("basePriceHyd"))
        this.fuelListForCity = this.fuelList
        break;
      case 'bangalore':
        this.fuelList = this.allFuelList.filter(obj => obj.hasOwnProperty("basePriceBlr"))
        this.fuelListForCity = this.fuelList
        break;
      case 'bhubaneswar':
        this.fuelList = this.allFuelList.filter(obj => obj.hasOwnProperty("basePriceBhu"))
        this.fuelListForCity = this.fuelList
        break;
      default:
        this.isUserCityOther = true
    } 
  } 

  togglePriceFilter(){
    this.showPriceFilter = !this.showPriceFilter
  }

  toggleAmountFilter(){
    this.showAmountFilter = !this.showAmountFilter
  }

  toggleSupplierFilter(){
    this.showSupplierFilter = !this.showSupplierFilter
  }

  toggleTypeFilter(){
    this.showTypeFilter = !this.showTypeFilter
  }

  sortByPrice(order: string){
    if(order === 'asc') this.fuelList.sort((a, b) =>  {
      let key: string;
      if(this.userCity.toLowerCase() === "hyderabad") key = "basePriceHyd"
      else if(this.userCity.toLowerCase() === "bangalore") key = "basePriceBlr"
      else if(this.userCity.toLowerCase() === "bhubaneswar") key = "basePriceBhu"
      else this.isUserCityOther = true
      return a[key] - b[key]
    }) 
    else if(order === 'desc') this.fuelList.sort((a, b) =>  {
      let key: string;
      if(this.userCity.toLowerCase() === "hyderabad") key = "basePriceHyd"
      else if(this.userCity.toLowerCase() === "bangalore") key = "basePriceBlr"
      else if(this.userCity.toLowerCase() === "bhubaneswar") key = "basePriceBhu"
      else this.isUserCityOther = true
      return b[key] - a[key]
    })    
  }

  sortByAmount(order: string){
    if(order === 'asc') this.fuelList.sort((a, b) => a["fuelStock"] - b["fuelStock"])
    else if(order === 'desc') this.fuelList.sort((a, b) => b["fuelStock"] - a["fuelStock"])
  }

  getFuelTypeList(){
    let fuelTypes = new Set<string>()
    this.allFuelList.forEach(fuel => {
      fuelTypes.add(fuel.fuelType)
    })
    this.fuelTypeList = Array.from(fuelTypes)
    this.fuelTypeList.unshift('All')
  }

  getFuelSuppliers(){
    let suppliers = new Set<string>();
    this.allFuelList.forEach(fuel => {
      suppliers.add(fuel.fuelSupplier.name)
    })
    this.fuelSupplierList = Array.from(suppliers)
    this.fuelSupplierList.unshift('All')
  }

  private addFuelTypeCheckbox(){
    this.fuelTypeList.map((f, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.fuelTypeFilterForm.controls['fuelTypes'] as FormArray).push(control)
    })
  }

  private addFuelSupplierCheckbox(){
    this.fuelSupplierList.map((f, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.fuelSupplierFilterForm.controls['fuelSuppliers'] as FormArray).push(control)
    })
  }

}
