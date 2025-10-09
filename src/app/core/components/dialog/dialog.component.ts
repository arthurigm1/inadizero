import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { DialogService, DialogData } from '../../../services/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="dialogData" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @backdropAnimation
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        (click)="closeDialog()"
      ></div>
      
      <!-- Dialog Container -->
      <div 
        class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        @dialogAnimation
      >
        <!-- Header with Icon -->
        <div class="p-6 pb-4">
          <div class="flex items-center space-x-4">
            <!-- Success Icon -->
            <div 
              *ngIf="dialogData.type === 'success'"
              class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <!-- Error Icon -->
            <div 
              *ngIf="dialogData.type === 'error'"
              class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            
            <!-- Warning Icon -->
            <div 
              *ngIf="dialogData.type === 'warning'"
              class="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            
            <!-- Info Icon -->
            <div 
              *ngIf="dialogData.type === 'info'"
              class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            
            <!-- Title and Close Button -->
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ dialogData.title }}
              </h3>
            </div>
            
            <!-- Close Button -->
            <button 
              *ngIf="dialogData.showCloseButton"
              (click)="closeDialog()"
              class="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Message -->
        <div class="px-6 pb-6">
          <p class="text-gray-600 leading-relaxed">
            {{ dialogData.message }}
          </p>
        </div>
        
        <!-- Progress Bar (for auto-close) -->
        <div 
          *ngIf="dialogData.duration && dialogData.duration > 0"
          class="h-1 bg-gray-200"
        >
          <div 
            class="h-full transition-all ease-linear"
            [class.bg-green-500]="dialogData.type === 'success'"
            [class.bg-red-500]="dialogData.type === 'error'"
            [class.bg-yellow-500]="dialogData.type === 'warning'"
            [class.bg-blue-500]="dialogData.type === 'info'"
            [style.width.%]="progressWidth"
            [style.transition-duration.ms]="dialogData.duration"
          ></div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'scale(0.8) translateY(-20px)' 
        }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ 
            opacity: 1, 
            transform: 'scale(1) translateY(0)' 
          })
        )
      ]),
      transition(':leave', [
        animate('200ms ease-in', 
          style({ 
            opacity: 0, 
            transform: 'scale(0.9) translateY(-10px)' 
          })
        )
      ])
    ])
  ]
})
export class DialogComponent implements OnInit, OnDestroy {
  dialogData: DialogData | null = null;
  progressWidth = 100;
  private subscription?: Subscription;

  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    this.subscription = this.dialogService.dialog$.subscribe(data => {
      this.dialogData = data;
      if (data && data.duration) {
        this.startProgressBar(data.duration);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  closeDialog() {
    this.dialogService.close();
  }

  private startProgressBar(duration: number) {
    this.progressWidth = 100;
    // Pequeno delay para garantir que a animação CSS funcione
    setTimeout(() => {
      this.progressWidth = 0;
    }, 50);
  }
}