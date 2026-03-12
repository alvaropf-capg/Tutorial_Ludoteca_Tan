import { Cliente } from "../../cliente/model/cliente";
import { Game } from "../../game/model/Game";

export class Prestamo {
  id: number;
  game: Game;
  cliente: Cliente;
  fechaPrestamo: string;
  fechaDevolucion: string;
}
