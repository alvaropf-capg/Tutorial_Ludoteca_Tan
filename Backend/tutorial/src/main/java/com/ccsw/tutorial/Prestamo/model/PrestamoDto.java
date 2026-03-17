package com.ccsw.tutorial.Prestamo.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * @author alperezf
 */

@Getter
@Setter
public class PrestamoDto {

    private Long id;
    private String nombreGame;
    private String nombreCliente;
    private LocalDate fechaPrestamo;
    private LocalDate fechaDevolucion;
}
