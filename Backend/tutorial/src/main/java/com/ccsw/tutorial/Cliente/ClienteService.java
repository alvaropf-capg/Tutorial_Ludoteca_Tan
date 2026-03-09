package com.ccsw.tutorial.Cliente;

import com.ccsw.tutorial.Cliente.Model.Cliente;
import com.ccsw.tutorial.Cliente.Model.ClienteDto;

import java.util.List;

/**
 * @author alperezf
 *
 */
public interface ClienteService {
    /**
     * Metodo para listar clientes
     *
     * @return {@link List} de {@link Cliente}
     */
    List<Cliente> findAll();

    /**
     * Metodo crear o actualizar clientes
     *
     * @param id PK de la entidad
     * @param dto datos de la entidad
     */
    void save(Long id, ClienteDto dto);

    /**
     * Metodo para borrar una cliente
     *
     * @param id PK de la entidad
     */
    void delete(Long id) throws Exception;
}
