package com.ccsw.tutorial.Prestamo.model;

import com.ccsw.tutorial.Cliente.Model.ClienteDto;
import com.ccsw.tutorial.game.model.GameDto;
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
    private GameDto game;
    private ClienteDto cliente;
    private LocalDate fechaPrestamos;
    private LocalDate fechaDevolucion;

}
