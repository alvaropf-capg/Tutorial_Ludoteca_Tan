package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.Prestamo.model.PrestamoDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoSearchDto;
import org.springframework.data.domain.Page;

/**
 * @author alperezf
 */
public interface PrestamoService {

    /**
     * Metodo para recuperar listado paginado de {@link Prestamo}
     *
     * @param dto dto de bsuqueda
     * @param {@link Page} de {@link Prestamo}
     */
    Page<Prestamo> findPage(PrestamoSearchDto dto);
    //aqui recibimos el PrestamoSearchDto con los filtro y paginacion

    /** Metodo para crear o actualizar un {@link Prestamo}
     *
     * @param id PK de la entidad
     * @param dto datos de la entidad
     */
    void save(Long id, PrestamoDto dto);

    /**
     * Metodo para eliminar un {@link Prestamo}
     *
     * @param id PK de la entidad
     */
    void delete(Long id) throws Exception;
}
