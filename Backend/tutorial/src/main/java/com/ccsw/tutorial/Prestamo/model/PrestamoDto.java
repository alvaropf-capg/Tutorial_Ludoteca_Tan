package com.ccsw.tutorial.Prestamo.model;

import lombok.Getter;
import lombok.Setter;

/**
 * @author alperezf
 */

@Getter
@Setter
public class PrestamoDto {

    private Long id;
    private String nombreGame;
    private String nombreCliente;
    private String fechaPrestamo;
    private String fechaDevolucion;
}
