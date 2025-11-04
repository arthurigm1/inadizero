import { bootstrapApplication } from '@angular/platform-browser';
// Habilita o compilador JIT no ambiente de desenvolvimento para evitar erros em componentes não compilados AOT
import '@angular/compiler';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
