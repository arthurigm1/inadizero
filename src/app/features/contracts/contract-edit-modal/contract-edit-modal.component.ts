import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ContractEditComponent } from '../contract-edit/contract-edit.component';
import { Contract } from '../contract.interfaces';

@Component({
  selector: 'app-contract-edit-modal',
  standalone: true,
  imports: [CommonModule, ContractEditComponent],
  template: `
    <!-- Edit Contract Modal -->
    <div *ngIf="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [@slideIn]>
      <div class="bg-white rounded-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        <app-contract-edit 
          [contractToEdit]="contractToEdit"
          (onCancel)="handleCancel()"
          (onSave)="handleSave($event)">
        </app-contract-edit>
      </div>
    </div>
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class ContractEditModalComponent {
  @Input() isVisible: boolean = false;
  @Input() contractToEdit: Contract | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Contract>();

  handleCancel(): void {
    this.onCancel.emit();
  }

  handleSave(contract: Contract): void {
    this.onSave.emit(contract);
  }
}