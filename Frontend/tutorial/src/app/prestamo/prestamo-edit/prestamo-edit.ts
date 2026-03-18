import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Prestamo } from "../model/Prestamo";
import { Cliente } from "../../cliente/model/cliente";
import { Game } from "../../game/model/Game";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ServicePrestamo } from "../service-prestamo";
import { ServiceGame } from "../../game/service-game";
import { ServiceCliente } from "../../cliente/service-cliente";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerToggle } from '@angular/material/datepicker';
import { PrestamoCreate } from "../model/PrestamoCreate";


@Component({
  selector: 'app-prestamo-edit',
  imports: [
      CommonModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      MatIconModule,
      MatDatepickerModule,
      MatDatepickerToggle
    ],
  providers: [
      provideNativeDateAdapter()
    ],

  templateUrl: './prestamo-edit.html',
  styleUrl: './prestamo-edit.scss',
})
export class PrestamoEditComponent implements OnInit {

  prestamo: PrestamoCreate;
  clientes: Cliente[] = [];
  games: Game[] = [];


  fechaPrestamoModel: Date | null = null;
  fechaDevolucionModel: Date | null = null;

  error = '';
  success = '';



  constructor(
      public dialogRef: MatDialogRef<PrestamoEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private servicePrestamo: ServicePrestamo,
      private serviceCliente: ServiceCliente,
      private serviceGame: ServiceGame

    ) {}

    ngOnInit(): void {

      if (this.data?.prestamo) {
        const existingPrestamo = this.data.prestamo as Prestamo;
        this.prestamo = new PrestamoCreate();
        this.prestamo.id = existingPrestamo.id;
      } else {
        // Crear nuevo
        this.prestamo = new PrestamoCreate();
      }

      if (this.prestamo.fechaPrestamo) {
        this.fechaPrestamoModel = new Date(this.prestamo.fechaPrestamo);
      }
      if (this.prestamo.fechaDevolucion) {
        this.fechaDevolucionModel = new Date(this.prestamo.fechaDevolucion);
      }

      // Cargar combos
      this.serviceCliente.getClientes().subscribe((clientes) => {
          this.clientes = clientes;
      });

      this.serviceGame.getAllGames().subscribe((games) => {
          this.games = games;
      });
    }

    private toIsoDate(d: Date | null): string | undefined {
      return d ? d.toISOString().split('T')[0] : undefined;
    }

    onSave() {
      // Validaciones
      if (!this.prestamo.gameId) {
        this.error = 'Debes seleccionar un juego';
        return;
      }

      if (!this.prestamo.clienteId) {
        this.error = 'Debes seleccionar un cliente';
        return;
      }

      if (!this.fechaPrestamoModel) {
        this.error = 'Debes indicar la fecha de préstamo';
        return;
      }

      if (this.fechaPrestamoModel > new Date()) {
        this.error = 'La fecha de préstamo no puede ser en el futuro';
        return;
      }

      if (this.fechaDevolucionModel && this.fechaDevolucionModel < this.fechaPrestamoModel) {
        this.error = 'La fecha de devolución debe ser posterior a la de préstamo';
        return;
      }

      // Convertir fechas
      this.prestamo.fechaPrestamo = this.toIsoDate(this.fechaPrestamoModel) || '';
      this.prestamo.fechaDevolucion = this.toIsoDate(this.fechaDevolucionModel);

      // Enviar al back
      this.servicePrestamo.savePrestamo(this.prestamo).subscribe(
        () => {
          this.success = 'Préstamo guardado correctamente';
          setTimeout(() => this.dialogRef.close(), 1000);
        },
        (error) => {
          this.error = error.error?.message || 'Error al guardar el préstamo';
          console.error(error);
        }
      );
    }

    onClose() {
      this.dialogRef.close();
    }

}
