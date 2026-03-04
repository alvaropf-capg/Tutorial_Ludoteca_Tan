import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'zone.js' // Para evitar este error al cargar la pagina main.ts:6  RuntimeError: NG0908: In this configuration Angular requires Zone.j


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
