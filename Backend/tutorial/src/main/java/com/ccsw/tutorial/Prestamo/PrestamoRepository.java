package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * @author alperezf
 */
public interface PrestamoRepository extends JpaRepository<Prestamo, Long>, JpaSpecificationExecutor<Prestamo> {

    //Con JpaRepository le damos ciertos metodos desde Spring, como findById, save, ...
    //JpaSpecificationExecutor nos pertime filtrar por criterios

    /**
     * Metodo para recuperar un listado paginal de {@Prestamo}
     *
     * @param pageable pageablo
     * @return {@link Page} de {@link Prestamo}
     */
    @Override
    @EntityGraph(attributePaths = { "game", "cliente" })
    //Hace consulta optimizada Prestamo + Game + Cliente sin N+1 queries
    Page<Prestamo> findAll(Specification<Prestamo> spec, Pageable pageable);
    //spec son los filtros dinamicos
    //pageable numero de pagina, tamaño, sort
    //devolvemos Page<Prestamo> lista pafinada de prestamos
}
