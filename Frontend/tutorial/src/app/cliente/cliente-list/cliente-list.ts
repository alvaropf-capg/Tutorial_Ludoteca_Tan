import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Cliente } from '../model/cliente';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServiceCategory } from '../../category/service-category';
import { ServiceCliente } from '../service-cliente';
import { MatDialog } from '@angular/material/dialog';
import { ClienteEditComponent } from '../cliente-edit/cliente-edit';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [MatButtonModule,
        MatIconModule,
        MatTableModule,
        CommonModule],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.scss',
})
export class ClienteListComponent implements OnInit{
  dataSource = new MatTableDataSource<Cliente>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private serviceCliente: ServiceCliente,
    public dialog: MatDialog,
  ){}

  createCliente() {
    const dialogRef = this.dialog.open(ClienteEditComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.serviceCliente.getClientes().subscribe(
      clientes => this.dataSource.data = clientes
    );
  }

  editCliente(cliente: Cliente) {
    const dialogRef = this.dialog.open(ClienteEditComponent, {
      data: { cliente}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteCliente(cliente: Cliente) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {title: "Eliminar cliente", description: "Atencion si borra el cliente se perferan sus datos. <br> ¿Desea eliminar el cliente?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.serviceCliente.deleteCliente(cliente.id).subscribe(result => {
          this.ngOnInit();
        });
      }
    });
  }
}
