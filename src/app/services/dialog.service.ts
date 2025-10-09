import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DialogData {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogSubject = new BehaviorSubject<DialogData | null>(null);
  public dialog$ = this.dialogSubject.asObservable();

  constructor() { }

  showSuccess(title: string, message: string, duration: number = 4000) {
    this.show({
      type: 'success',
      title,
      message,
      duration,
      showCloseButton: true
    });
  }

  showError(title: string, message: string, duration: number = 6000) {
    this.show({
      type: 'error',
      title,
      message,
      duration,
      showCloseButton: true
    });
  }

  showWarning(title: string, message: string, duration: number = 5000) {
    this.show({
      type: 'warning',
      title,
      message,
      duration,
      showCloseButton: true
    });
  }

  showInfo(title: string, message: string, duration: number = 4000) {
    this.show({
      type: 'info',
      title,
      message,
      duration,
      showCloseButton: true
    });
  }

  private show(data: DialogData) {
    this.dialogSubject.next(data);
    
    if (data.duration && data.duration > 0) {
      setTimeout(() => {
        this.close();
      }, data.duration);
    }
  }

  close() {
    this.dialogSubject.next(null);
  }
}