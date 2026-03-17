package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.Prestamo.model.PrestamoCreateDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoSearchDto;
import org.springframework.data.domain.Page;

/**
 * @author alperezf
 */
public interface PrestamoService {

    /**
     * Metodo para recuperar un listado paginado de {@link Prestamo}
     *
     * @param dto dto de busqueda
     * @return {link Page} de {@link Prestamo}
     */
    Page<PrestamoDto> findPage(PrestamoSearchDto dto);

    /**
     * Metodo para crear o actualizar un {@link Prestamo}
     *
     * @param id PK de la entidad
     * @param dto datos de la entidad
     */
    void save(Long id, PrestamoCreateDto dto);

    /**
     * Metodo para crear o actualizar un {@link Prestamo}
     *
     * @param id PK de la entidad
     */
    void delete(Long id) throws Exception;
}
