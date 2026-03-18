import { Prestamo } from './Prestamo';
export class PrestamoCreate {
  id?: number;
  gameId: number;
  clienteId: number;
  fechaPrestamo: string;
  fechaDevolucion?: string;
}
