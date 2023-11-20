import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/shared/service/localStorage.service';

@Component({
  selector: 'app-fuel-item',
  templateUrl: './fuel-item.component.html',
  styleUrls: ['./fuel-item.component.css']
})
export class FuelItemComponent implements OnInit{
  @Input() fuel;
  userRole: string;
  constructor(private localStorageService: LocalStorageService){}
  ngOnInit(): void {
    // get user role from localStorage
    this.userRole = this.localStorageService.getItem('userRole')
  }
}
