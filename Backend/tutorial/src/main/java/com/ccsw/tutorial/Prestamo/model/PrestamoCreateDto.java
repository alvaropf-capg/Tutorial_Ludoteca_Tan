package com.ccsw.tutorial.Prestamo.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * @author alperezf
 */
@Getter
@Setter
public class PrestamoCreateDto {

    private Long id;
    private Long gameId;
    private Long clienteId;
    private LocalDate fechaPrestamo;
    private LocalDate fechaDevolucion;
}
