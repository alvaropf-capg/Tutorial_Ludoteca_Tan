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

  clienteCtrl = new FormControl<string | Cliente>('');
  gameCtrl = new FormControl<string | Game>('');

  filteredClientes$!: Observable<Cliente[]>;
  filteredGames$!: Observable<Game[]>;

  fechaPrestamoModel: Date | null = null;
  fechaDevolucionModel: Date | null = null;

  minDevolucion: Date | null = null;
  maxDevolucion: Date | null = null;

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

    // Inicializar préstamo
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

    // ✅ PARSEAR FECHAS SIN TIMEZONE
    if (this.prestamo.fechaPrestamo) {
      this.fechaPrestamoModel = this.parseDateLocal(this.prestamo.fechaPrestamo);
    }
    if (this.prestamo.fechaDevolucion) {
      this.fechaDevolucionModel = this.parseDateLocal(this.prestamo.fechaDevolucion);
    }

    // ✅ Inicializar límites de devolución si aplica
    if (this.fechaPrestamoModel) {
      this.onFechaPrestamoChange();
    }

    // Cargar clientes
    this.serviceCliente.getClientes().subscribe((clientes) => {
      this.clientes = clientes;

      if (this.prestamo.clienteId) {
        const selected = this.clientes.find(c => c.id === this.prestamo.clienteId);
        if (selected) this.clienteCtrl.setValue(selected);
      }

      this.filteredClientes$ = this.clienteCtrl.valueChanges.pipe(
        startWith(this.clienteCtrl.value ?? ''),
        map(value => this._filterClientes(value))
      );
    });

    // Cargar juegos
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

  // ✅ CREAR FECHA SIN DESPLAZAMIENTO POR ZONA HORARIA
  private parseDateLocal(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private _filterClientes(value: string | Cliente): Cliente[] {
    const text = typeof value === 'string' ? value : value?.name ?? '';
    return this.clientes.filter(c => c.name.toLowerCase().includes(text.toLowerCase()));
  }

  private _filterGames(value: string | Game): Game[] {
    const text = typeof value === 'string' ? value : value?.title ?? '';
    return this.games.filter(g => g.title.toLowerCase().includes(text.toLowerCase()));
  }

  displayCliente = (c?: Cliente | string): string =>
    !c ? '' : typeof c === 'string' ? c : c.name;

  displayGame = (g?: Game | string): string =>
    !g ? '' : typeof g === 'string' ? g : g.title;

  private normalizeDate(d: Date): Date {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  }

  // ✅ LIMITES DE DEVOLUCIÓN DINÁMICOS
  onFechaPrestamoChange() {
    if (!this.fechaPrestamoModel) {
      this.minDevolucion = null;
      this.maxDevolucion = null;
      this.fechaDevolucionModel = null;
      return;
    }

    const start = this.normalizeDate(this.fechaPrestamoModel);

    this.minDevolucion = new Date(start);

    const max = new Date(start);
    max.setDate(max.getDate() + 14);
    this.maxDevolucion = max;

    if (this.fechaDevolucionModel) {
      const end = this.normalizeDate(this.fechaDevolucionModel);
      if (end < this.minDevolucion) this.fechaDevolucionModel = new Date(this.minDevolucion);
      if (end > this.maxDevolucion) this.fechaDevolucionModel = new Date(this.maxDevolucion);
    }
  }

  // ✅ GUARDAR SIN TIMEZONE
  private toIsoLocal(date: Date | null): string | undefined {
    if (!date) return undefined;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
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

    // VALIDACIONES
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

    // ✅ Validación final de 14 días
    if (this.fechaPrestamoModel && this.fechaDevolucionModel) {
      const start = this.normalizeDate(this.fechaPrestamoModel).getTime();
      const end = this.normalizeDate(this.fechaDevolucionModel).getTime();
      const diff = Math.floor((end - start) / (24 * 60 * 60 * 1000));

      if (diff > 14) {
        this.error = 'El préstamo no puede superar los 14 días de duración';
        return;
      }
    }

    // ✅ GUARDAR FECHAS CORRECTAS SIN TZ
    this.prestamo.fechaPrestamo = this.toIsoLocal(this.fechaPrestamoModel) || '';
    this.prestamo.fechaDevolucion = this.toIsoLocal(this.fechaDevolucionModel);

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
``
