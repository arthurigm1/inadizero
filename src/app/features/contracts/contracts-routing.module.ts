import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractsComponent } from './contracts.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractCreateComponent } from './contract-create/contract-create.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { ContractEditComponent } from './contract-edit/contract-edit.component';
import { ContractReportsComponent } from './contract-reports/contract-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ContractsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ContractListComponent,
        data: { title: 'Lista de Contratos' }
      },
      {
        path: 'create',
        component: ContractCreateComponent,
        data: { title: 'Criar Contrato' }
      },
      {
        path: 'details/:id',
        component: ContractDetailsComponent,
        data: { title: 'Detalhes do Contrato' }
      },
      {
      path: 'edit/:id',
      component: ContractEditComponent,
      title: 'Editar Contrato'
    },
    {
       path: 'reports',
       component: ContractReportsComponent,
       title: 'Relatórios de Contratos'
     }
   ]
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }