package com.ccsw.tutorial.Cliente.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * @author alperezf
 *
 */
@Entity
@Setter
@Getter
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;
}
