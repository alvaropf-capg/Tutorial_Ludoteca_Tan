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
],
  templateUrl: './prestamo-edit.html',
  styleUrl: './prestamo-edit.scss',
})
export class PrestamoEditComponent implements OnInit {

  prestamo: Prestamo;


  clientes: Cliente[] = [];
  games: Game[] = [];


  fechaPrestamoModel: Date | null = null;
  fechaDevolucionModel: Date | null = null;



  constructor(
      public dialogRef: MatDialogRef<PrestamoEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private servicePrestamo: ServicePrestamo,
      private serviceCliente: ServiceCliente,
      private serviceGame: ServiceGame

    ) {}

    ngOnInit(): void {
      this.prestamo = this.data?.prestamo? Object.assign({}, this.data.prestamo): new Prestamo();


      if (this.prestamo.fechaPrestamo) {
            this.fechaPrestamoModel = new Date(this.prestamo.fechaPrestamo);
          }
      if (this.prestamo.fechaDevolucion) {
        this.fechaDevolucionModel = new Date(this.prestamo.fechaDevolucion);
      }

      // Cargar combos
      this.serviceCliente.getClientes().subscribe((clientes) => {
          this.clientes = clientes;

          // Si venía un cliente, reasignar la referencia desde el listado
          if (this.prestamo.cliente) {
            const found = this.clientes.find(c => c.id === this.prestamo.cliente.id);
            if (found) this.prestamo.cliente = found;
          }
      });

      this.serviceGame.getGames().subscribe((games) => {
          this.games = games;

          if (this.prestamo.game) {
            const found = this.games.find(g => g.id === this.prestamo.game.id);
            if (found) this.prestamo.game = found;
          }
      });
    }

    private toIsoDate(d: Date | null): string | undefined {
      return d ? d.toISOString().split('T')[0] : undefined; // 'YYYY-MM-DD'
    }

    onSave() {
      this.prestamo.fechaPrestamo = this.toIsoDate(this.fechaPrestamoModel);
      this.prestamo.fechaDevolucion = this.toIsoDate(this.fechaDevolucionModel);

      this.servicePrestamo.savePrestamo(this.prestamo).subscribe(() => {
        this.dialogRef.close();
      });

    }

    onClose() {
      this.dialogRef.close();
    }

}
