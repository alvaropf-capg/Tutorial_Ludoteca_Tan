import { Component, Inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel, MatError, MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Cliente } from '../model/cliente';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceCliente } from '../service-cliente';

@Component({
  selector: 'app-cliente-edit',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './cliente-edit.html',
  styleUrl: './cliente-edit.scss',
})
export class ClienteEditComponent implements OnInit {
  cliente: Cliente;

  constructor(
    public dialogRef: MatDialogRef<ClienteEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {cliente: Cliente},
    private serviceCliente: ServiceCliente
  ){}

  ngOnInit(): void {
    this.cliente = this.data.cliente ? Object.assign({}, this.data.cliente) : new Cliente();
  }

  onSave(){
    this.serviceCliente.saveCliente(this.cliente).subscribe(() => {
      this.dialogRef.close();
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
