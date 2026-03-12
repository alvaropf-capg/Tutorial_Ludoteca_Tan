import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ServicePrestamo } from '../service-prestamo';
import { Prestamo } from '../model/Prestamo';

@Component({
  selector: 'app-prestamo-edit',
  imports: [
    FormsModule,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
],
  templateUrl: './prestamo-edit.html',
  styleUrl: './prestamo-edit.scss',
})
export class PrestamoEditComponent implements OnInit {

  prestamo: Prestamo;

  constructor(
      public dialogRef: MatDialogRef<PrestamoEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private servicePrestamo: ServicePrestamo
    ) {}

    ngOnInit(): void {
      this.prestamo = this.data.prestamo ? Object.assign({}, this.data.prestamo) : new Prestamo();
    }

    onSave() {
      this.servicePrestamo.savePrestamo(this.prestamo).subscribe(() => {
        this.dialogRef.close();
      });
    }

    onClose() {
      this.dialogRef.close();
    }

}
