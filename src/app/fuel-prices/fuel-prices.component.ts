import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IconDefinition, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FuelPriceService } from 'src/shared/service/fuelPrice.service';
import { Subscription } from 'rxjs';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fuel-prices',
  templateUrl: './fuel-prices.component.html',
  styleUrls: ['./fuel-prices.component.css']
})
export class FuelPricesComponent implements OnInit, OnDestroy{
  faSpinner: IconDefinition = faSpinner;
  fuelPriceSubscription: Subscription = null;
  fuelPricesList: any = [];
  isLoading: boolean = false;
  cities: string[] = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Bhubaneswar"]
  labels: string[] = ["Petrol (₹/Liter)", "Diesel (₹/Liter)", "CNG (₹/Kg)", "LPG (₹/Kg)"]
  filterCityForm: FormGroup = null;
  filteredFuelPriceList: any = []
  datasets: any = []

  constructor(
    private fuelPriceService: FuelPriceService,
    private fb: FormBuilder
  ){
    this.filterCityForm = this.fb.group({
      selectedCity: ['All']
    })
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  ngOnInit(): void {
    this.fuelPricesList = this.fuelPriceService.getFuelPrices();
    // filter fuel prices
    this.filterPricesAndUpdateChart('All');
    this.filterCityForm.valueChanges.subscribe(value => {
      this.filterPricesAndUpdateChart(value.selectedCity)
    })
  }

  onGetFuelPrices() {
    this.isLoading = true;
    this.fuelPriceSubscription = this.fuelPriceService
      .fetchLatestFuelPrices()
      .subscribe(
        (updatedPrices) => {
          this.fuelPricesList = updatedPrices;
          // set selected city
          let selectedCity = this.filterCityForm.get("selectedCity").value
          // filter fuel prices
          this.filterPricesAndUpdateChart(selectedCity);
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,    
    maintainAspectRatio: true,
    scales: {
      x: {},
      y: {
        min: 40,
        max: 140
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: this.labels,
    datasets: this.datasets,
  };

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {}

  private filterPricesAndUpdateChart(selectedCity: string){
    if(selectedCity === 'All') selectedCity = ''
    let pricesList = this.fuelPricesList.filter(obj => obj.cityId.toLowerCase().includes(selectedCity.toLowerCase()))
    let datasetList = []
    // create datasets
    for(const fuelObj of pricesList){
      let datasetValues = []
      const datasetLabel = fuelObj.cityName
      const priceObj = fuelObj["pricing"] 
      for (const fuelName in priceObj){
        datasetValues.push(priceObj[fuelName]["price"])
      }
      datasetList.push({
        data: datasetValues,
        label: datasetLabel
      })
    }
    // set datasets and update chart
    this.barChartData.datasets = datasetList
    this.chart?.update();
  }
  
  ngOnDestroy(): void {
    if(this.fuelPriceSubscription) this.fuelPriceSubscription.unsubscribe();
  }
}
