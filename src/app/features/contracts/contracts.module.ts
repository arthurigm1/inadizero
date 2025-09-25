import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContractsComponent } from './contracts.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { ContractEditComponent } from './contract-edit/contract-edit.component';
import { ContractService } from './contract.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ContractsComponent,
    ContractListComponent,
    ContractDetailsComponent,
    ContractEditComponent,
  ],
  providers: [
    ContractService
  ]
})
export class ContractsModule { }