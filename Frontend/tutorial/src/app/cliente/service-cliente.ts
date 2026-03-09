import { Injectable } from '@angular/core';
import { Cliente } from './model/cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceCliente {
  constructor() { }

  getClientes(): Observable<Cliente[]> {
    return new Observable();}
}
