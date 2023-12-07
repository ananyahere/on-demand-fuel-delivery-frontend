import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/shared/service/order.service';

import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit{
  insights: any;
  isLoadingInsights: boolean = false;
  fuels: string[] = []
  filterFuelForm: FormGroup = null
  percentage = [
    {
      waste: 0.05,
      use: 0.95
    },
    {
      waste: 0.15,
      use: 0.85
    },
    {
      waste: 0.10,
      use: 0.90
    }
  ]

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder
  ){
    this.filterFuelForm = this.fb.group({
      selectedFuel: ['Petrol']
    })
  }

  ngOnInit(): void {
    this.isLoadingInsights = true;

    this.orderService.getInsights().subscribe(
      fuelInsight => {
        this.insights = this.getFuelInsights(fuelInsight)
        console.log("this.insights:",this.insights)
        // filter fuel 
        this.filterFuelAndUpdateChart("Petrol")
        this.isLoadingInsights = false;
      }
    )

    // filter fuel
    this.filterFuelForm.valueChanges.subscribe(value => {
      this.filterFuelAndUpdateChart(value.selectedFuel)
    })

  }

  private getFuelInsights(fuelInsights: any){
    let insights = []
    let allFuels = []
    for (const fuel in fuelInsights) {
      allFuels.push(fuel)
      const percentage = this.getRandomPercentage()
      insights.push({
        fuelType: fuel,
        fuelOrdered: percentage.use * fuelInsights[fuel]["fuelOrdered"],
        fuelWasted: percentage.waste * fuelInsights[fuel]["fuelOrdered"],
        fuelInStock: fuelInsights[fuel]["fuelInStock"]
      })
    }
    this.fuels = allFuels
    return insights
  }

    // Pie
    public pieChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        datalabels: {
          formatter: (value: any, ctx: any) => {
            if (ctx.chart.data.labels) {
              return ctx.chart.data.labels[ctx.dataIndex];
            }
          },
        },
      },
    };
    public pieChartData: ChartData<'pie', number[], string | string[]> = {
      labels: ['Ordered', 'Wasted'],
      datasets: [
        {
          data: [109, 10],
        },
      ],
    };
    public pieChartType: ChartType = 'pie';
    public pieChartPlugins = [DatalabelsPlugin];

    public chartHovered({
      event,
      active,
    }: {
      event: ChartEvent;
      active: object[];
    }): void {
      console.log(event, active);
    }

    private filterFuelAndUpdateChart(selectedFuel: string){
      console.log("filterFuelAndUpdateChart")
      let fuelInfo = this.insights.find(obj => obj.fuelType.toLowerCase().includes(selectedFuel.toLowerCase()));
      console.log(fuelInfo);
      // create dataset
      let dataset = []
      // dataset.push(fuelInfo["fuelInStock"])  // in-stock
      dataset.push(fuelInfo["fuelOrdered"])  // ordered
      dataset.push(fuelInfo["fuelWasted"])  // wasted
      this.pieChartData.datasets = [{
        data: dataset
      }]
      this.chart?.update()
    }

    private getRandomPercentage(){
      return this.percentage[(Math.floor(Math.random() * this.percentage.length))]
    }

}
