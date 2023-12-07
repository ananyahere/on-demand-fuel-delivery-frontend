import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SidebarService{
    isSidebarPopup: boolean = false;

    public toggleSidebar(){
        this.isSidebarPopup = !this.isSidebarPopup;
    }

    public getSidebarPopup(): boolean{
        return this.isSidebarPopup;
    }
}