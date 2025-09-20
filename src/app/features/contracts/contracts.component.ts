import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <router-outlet></router-outlet>
  `
})
export class ContractsComponent implements OnInit {
  activeContracts = 0;
  expiringContracts = 0;
  expiredContracts = 0;

  ngOnInit() {
    // TODO: Carregar estatísticas dos contratos
  }
}