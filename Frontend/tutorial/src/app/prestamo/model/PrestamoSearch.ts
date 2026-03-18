import { Pageable } from "../../core/model/page/Pageable";

export class PrestamoSearch {
  pageable: Pageable;
  gameTitle?: string;
  clienteName?: string;
  fechaPrestamoFrom?: string;
  fechaPrestamoTo?: string;
  fechaDevolucionFrom?: string; 
  fechaDevolucionTo?: string;

}
