import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractCreateComponent } from './contract-create/contract-create.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { ContractEditComponent } from './contract-edit/contract-edit.component';
import { ContractRescindModalComponent } from './contract-rescind-modal/contract-rescind-modal.component';
import { ContractRenewModalComponent } from './contract-renew-modal/contract-renew-modal.component';
import { ContractReportsComponent } from './contract-reports/contract-reports.component';
import { ContractService } from './contract.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ContractsRoutingModule,
    ContractsComponent,
    ContractListComponent,
    ContractCreateComponent,
    ContractDetailsComponent,
    ContractEditComponent,
    ContractRescindModalComponent,
    ContractRenewModalComponent,
    ContractReportsComponent
  ],
  providers: [
    ContractService
  ]
})
export class ContractsModule { }