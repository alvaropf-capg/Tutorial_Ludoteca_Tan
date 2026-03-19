import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { map, Observable, startWith } from "rxjs";
import { MatAutocompleteModule } from "@angular/material/autocomplete";


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
      MatDatepickerToggle,
      ReactiveFormsModule,
      MatAutocompleteModule
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

  // Controles para los inputs de autocompletar
  clienteCtrl = new FormControl<string | Cliente>('');
  gameCtrl = new FormControl<string | Game>('');

  // Streams con listas filtradas
  filteredClientes$!: Observable<Cliente[]>;
  filteredGames$!: Observable<Game[]>;

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
    // Inicializar prestamo
    if (this.data?.prestamo) {
      const existingPrestamo = this.data.prestamo as Prestamo;
      this.prestamo = new PrestamoCreate();
      this.prestamo.id = existingPrestamo.id;
      this.prestamo.clienteId = (this.data.prestamo as any).clienteId ?? undefined;
      this.prestamo.gameId = (this.data.prestamo as any).gameId ?? undefined;
      this.prestamo.fechaPrestamo = (this.data.prestamo as any).fechaPrestamo ?? '';
      this.prestamo.fechaDevolucion = (this.data.prestamo as any).fechaDevolucion ?? undefined;
    } else {
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

      // precarga el control con el objeto en edicion
      if (this.prestamo.clienteId) {
        const selected = this.clientes.find(c => c.id === this.prestamo.clienteId);
        if (selected) this.clienteCtrl.setValue(selected);
      }

      // Configuracion filtrado reactivo
      this.filteredClientes$ = this.clienteCtrl.valueChanges.pipe(
        startWith(this.clienteCtrl.value ?? ''),
        map(value => this._filterClientes(value))
      );
    });

    this.serviceGame.getAllGames().subscribe((games) => {
      this.games = games;

      if (this.prestamo.gameId) {
        const selected = this.games.find(g => g.id === this.prestamo.gameId);
        if (selected) this.gameCtrl.setValue(selected);
      }

      this.filteredGames$ = this.gameCtrl.valueChanges.pipe(
        startWith(this.gameCtrl.value ?? ''),
        map(value => this._filterGames(value))
      );
    });
  }

  // helpers de filtrado
  private _filterClientes(value: string | Cliente): Cliente[] {
    const text = typeof value === 'string' ? value : value?.name ?? '';
    const filter = text.toLowerCase().trim();
    return this.clientes.filter(c => c.name.toLowerCase().includes(filter));
  }

  private _filterGames(value: string | Game): Game[] {
    const text = typeof value === 'string' ? value : value?.title ?? '';
    const filter = text.toLowerCase().trim();
    return this.games.filter(g => g.title.toLowerCase().includes(filter));
  }

  // mostrar el texto en el input cuando el value es el objeto
  displayCliente = (cliente?: Cliente | string): string => {
    if (!cliente) return '';
    return typeof cliente === 'string' ? cliente : cliente.name;
  };

  displayGame = (game?: Game | string): string => {
    if (!game) return '';
    return typeof game === 'string' ? game : game.title;
  };

  private toIsoDate(date: Date | null): string | undefined {
    return date ? date.toISOString().split('T')[0] : undefined;
  }

  onSave() {
    if (!this.prestamo.clienteId && this.clienteCtrl.value) {
      const val = this.clienteCtrl.value;
      const name = typeof val === 'string' ? val : val.name;
      const found = this.clientes.find(c => c.name.toLowerCase() === name?.toLowerCase());
      if (found) this.prestamo.clienteId = found.id;
    }
    if (!this.prestamo.gameId && this.gameCtrl.value) {
      const val = this.gameCtrl.value;
      const title = typeof val === 'string' ? val : val.title;
      const found = this.games.find(g => g.title.toLowerCase() === title?.toLowerCase());
      if (found) this.prestamo.gameId = found.id;
    }

    // validaciones
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

    // convertir fechas
    this.prestamo.fechaPrestamo = this.toIsoDate(this.fechaPrestamoModel) || '';
    this.prestamo.fechaDevolucion = this.toIsoDate(this.fechaDevolucionModel);

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
