import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PrestamoSearch } from '../model/PrestamoSearch';
import { Prestamo } from '../model/Prestamo';
import { ServicePrestamo } from '../service-prestamo';
import { MatDialog } from '@angular/material/dialog';
import { PrestamoEditComponent } from '../prestamo-edit/prestamo-edit';

@Component({
  selector: 'app-prestamo-list',
  imports: [CommonModule, MatTableModule, MatPaginator],
  templateUrl: './prestamo-list.html',
  styleUrl: './prestamo-list.scss',
})
export class PrestamoListComponent implements OnInit {

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
    this.search.pageable.pageNumber = 0;
    this.loadPage();
  }

  cleanFilters() {
    this.search.idCliente = undefined;
    this.search.idGame = undefined;
    this.search.fechaInicio = undefined;
    this.search.fechaFin = undefined;
    this.applyFilters();
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
