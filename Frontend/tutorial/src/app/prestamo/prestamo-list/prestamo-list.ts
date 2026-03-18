import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';

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

  // FILTROS
  filterGameTitle: string = '';
  filterClienteName: string = '';
  filterFechaPrestamoFrom: Date | null = null;
  filterFechaPrestamoTo: Date | null = null;

  search: PrestamoSearch = {
    pageable: {
      pageNumber: 0,
      pageSize: 5,
      sort: [{ property: 'fechaPrestamo', direction: 'DESC' }]
    }
  };

  totalElements = 0;

  dataSource = new MatTableDataSource<Prestamo>();
  displayedColumns: string[] = ['id', 'clienteName', 'gameName', 'fechaPrestamo', 'fechaDevolucion', 'action', 'debug'];

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
      console.log('🔎 Ejemplo de fila recibida:', data?.content?.[0]); //temporal

      this.dataSource.data = data.content;
      this.search.pageable.pageNumber = data.pageable.pageNumber;
      this.search.pageable.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  applyFilters() {
    this.search.gameTitle = this.filterGameTitle || undefined;
    this.search.clienteName = this.filterClienteName || undefined;
    this.search.fechaPrestamoFrom = this.filterFechaPrestamoFrom ?
      this.filterFechaPrestamoFrom.toISOString().split('T')[0] : undefined;
    this.search.fechaPrestamoTo = this.filterFechaPrestamoTo ?
      this.filterFechaPrestamoTo.toISOString().split('T')[0] : undefined;

    this.search.pageable.pageNumber = 0;
    this.loadPage();
  }

  cleanFilters() {
    this.filterGameTitle = '';
    this.filterClienteName = '';
    this.filterFechaPrestamoFrom = null;
    this.filterFechaPrestamoTo = null;

    this.search.gameTitle = undefined;
    this.search.clienteName = undefined;
    this.search.fechaPrestamoFrom = undefined;
    this.search.fechaPrestamoTo = undefined;

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

  deletePrestamo(prestamo: Prestamo) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar préstamo',
        description: 'Atención si borra el préstamo se perderán sus datos. <br> ¿Desea eliminar el préstamo?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.servicePrestamo.deletePrestamo(prestamo.id).subscribe(() => {
          this.loadPage();
        });
      }
    });
  }
}
