import { Component } from '@angular/core';
// import { SidebarService } from 'src/shared/service/sidebar';
import { IconDefinition, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar-container',
  templateUrl: './sidebar-container.component.html',
  styleUrls: ['./sidebar-container.component.css']
})
export class SidebarContainerComponent {
  // constructor(private sidebarService: SidebarService){}
  isSidebarPopup: boolean = false;
  faBars: IconDefinition = faBars;

  public toggleSidebar(){
      this.isSidebarPopup = !this.isSidebarPopup;
  }

  public getSidebarPopup(): boolean{
      return this.isSidebarPopup;
  }
}
