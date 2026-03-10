package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

/**
 * @author alperezf
 */
public interface PrestamoRepository extends CrudRepository<Prestamo, Long> {
    /**
     * Metodo para recuperar un listado paginal de {@Prestamo}
     *
     * @param pageable pageablo
     * @return {@link Page} de {@link Prestamo}
     */
    Page<Prestamo> findAll(Pageable pageable);
}
