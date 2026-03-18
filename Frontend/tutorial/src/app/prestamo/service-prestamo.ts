import { Injectable } from '@angular/core';
import { PrestamoPage } from './model/PrestamoPage';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PrestamoSearch } from './model/PrestamoSearch';
import { Prestamo } from './model/Prestamo';

@Injectable({
  providedIn: 'root',
})
export class ServicePrestamo {

  private baseUrl = 'http://localhost:8080/prestamos';

  constructor(private http: HttpClient) {}

  getPrestamos(search: PrestamoSearch): Observable<PrestamoPage> {

  return this.http.post<PrestamoPage>(this.baseUrl, search);
  }

  savePrestamo(prestamo: Prestamo): Observable<void> {

    const { id } = prestamo;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<void>(url, prestamo);
  }

  deletePrestamo(id: number): Observable<void> {

    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
