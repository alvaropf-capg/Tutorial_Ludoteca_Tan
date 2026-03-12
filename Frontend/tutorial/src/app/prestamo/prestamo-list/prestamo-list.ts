import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PrestamoSearch } from '../model/PrestamoSearch';
import { Prestamo } from '../model/Prestamo';
import { ServicePrestamo } from '../service-prestamo';
import { MatDialog } from '@angular/material/dialog';
import { PrestamoEditComponent } from '../prestamo-edit/prestamo-edit';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormsModule, NgModel } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-prestamo-list',
  imports: [CommonModule,
            MatButton,
            MatIconModule,
            MatTableModule,
            MatPaginator,
            MatFormField,
            MatLabel,
            MatDatepicker,
            MatDatepickerToggle,
            MatDatepickerModule,
            FormsModule,
            MatInputModule,
            MatIconButton
  ],
  providers: [
    provideNativeDateAdapter()
  ],

  templateUrl: './prestamo-list.html',
  styleUrl: './prestamo-list.scss',
})
export class PrestamoListComponent implements OnInit {


filterTitulo: string = '';
filterCliente: string = '';
filterFecha: Date | null = null;


search: PrestamoSearch = {
    pageable: {
      pageNumber: 0,
      pageSize: 5,
      sort: [{ property: 'id', direction: 'ASC' }]
    }
  };

  totalElements = 0;

  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = ['id', 'cliente', 'game', 'fPrestamo', 'fDevolucion', 'action'];

  constructor(
    private servicePrestamo: ServicePrestamo,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(event?: PageEvent) {
    if (event) {
      this.search.pageable.pageNumber = event.pageIndex;
      this.search.pageable.pageSize = event.pageSize;
    }

    this.servicePrestamo.getPrestamos(this.search).subscribe((data) => {
      this.dataSource.data = data.content;
      this.search.pageable.pageNumber = data.pageable.pageNumber;
      this.search.pageable.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  applyFilters() {
    this.search.titulo = this.filterTitulo;
    this.search.clienteNombre = this.filterCliente;
    this.search.fecha = this.filterFecha ? this.filterFecha.toISOString().split('T')[0] : undefined;
    this.search.pageable.pageNumber = 0;

    this.loadPage();
  }

  cleanFilters() {
  this.filterTitulo = '';
  this.filterCliente = '';
  this.filterFecha = null;

  this.search.titulo = undefined;
  this.search.clienteNombre = undefined;
  this.search.fecha = undefined;

  this.search.pageable.pageNumber = 0;

  this.loadPage();

  }

  createPrestamo() {
    const dialogRef = this.dialog.open(PrestamoEditComponent, { data: {} });
    dialogRef.afterClosed().subscribe(() => this.loadPage());
  }

  editPrestamo(item: Prestamo) {
    const dialogRef = this.dialog.open(PrestamoEditComponent, { data: { prestamo: item }});
    dialogRef.afterClosed().subscribe(() => this.loadPage());
  }

  deletePrestamo(item: Prestamo) {
    this.servicePrestamo.deletePrestamo(item.id).subscribe(() => this.loadPage());
  }

}
