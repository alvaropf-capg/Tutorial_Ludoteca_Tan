import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Cliente } from '../model/cliente';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServiceCategory } from '../../category/service-category';
import { ServiceCliente } from '../service-cliente';

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
  ){}

  ngOnInit(): void {
    this.serviceCliente.getClientes().subscribe(
      clientes => this.dataSource.data = clientes
    );
  }
}
