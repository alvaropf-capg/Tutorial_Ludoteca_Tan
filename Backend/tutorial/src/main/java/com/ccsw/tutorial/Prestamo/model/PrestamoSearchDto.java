package com.ccsw.tutorial.Prestamo.model;

import com.ccsw.tutorial.common.pagination.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * @author alperezf
 */
@Getter
@Setter
public class PrestamoSearchDto {
    private PageableRequest pageable;

    //Filtros
    private String gameTitle; //Para buscar por titulo
    private String clienteName;  //Para buscar por nombre del cliente
    private LocalDate fechaPrestamoFrom;    //Fecha inicio prestamo
    private LocalDate fechaPrestamoTo;  //Fecha fin del prestamo
    private LocalDate fechaDevolucionFrom;  //Fecha inicio devolucion
    private LocalDate fechaDevolucionTo;    //fecha fin devolucion

}
