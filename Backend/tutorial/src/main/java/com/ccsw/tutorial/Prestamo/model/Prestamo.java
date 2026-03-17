package com.ccsw.tutorial.Prestamo.model;

import com.ccsw.tutorial.Cliente.Model.Cliente;
import com.ccsw.tutorial.game.model.Game;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * @author alperezf
 */

@Entity
@Table(name = "prestamo")
@Getter
@Setter
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "fecha_Prestamo")
    private LocalDate fechaPrestamo;

    @Column(name = "fecha_Devolucion")
    private LocalDate fechaDevolucion;
}
