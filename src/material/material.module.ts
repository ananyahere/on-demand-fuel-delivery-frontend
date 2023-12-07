import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule} from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser';


const MaterialComponent = [
    MatDialogModule,
    CdkAccordionModule,
    MatSnackBarModule,
    MatPaginatorModule
]

@NgModule({
    declarations: [],
    imports: [
      BrowserModule,
      CommonModule,
      MaterialComponent
    ],
    exports: [
      MaterialComponent
    ]
  })
  export class MaterialModule { }