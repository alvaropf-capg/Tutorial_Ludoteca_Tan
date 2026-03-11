import { Pageable } from "../../core/model/page/Pageable";

export class PrestamoSearch {
  pageable: Pageable;
  idCliente?: number;
  idGame?: number;
  fechaInicio?: string;
  fechaFin?: string;
}
