import { Cliente } from "../../cliente/model/cliente";
import { Game } from "../../game/model/Game";

export class Prestamo {
  id: number;
  gameName: string;
  clienteName: string;
  fechaPrestamo: string;
  fechaDevolucion?: string;
}
