package com.ccsw.tutorial.author;

import com.ccsw.tutorial.author.model.Author;
import com.ccsw.tutorial.author.model.AuthorDto;
import com.ccsw.tutorial.author.model.AuthorSearchDto;
import org.springframework.data.domain.Page;

/**
 * @author ccsw
 *
 */
public interface AuthorService {

    /**
     * Metodo para recuperar un listado paginado de {@link Author}
     *
     * @param dto dto busqueda
     * @return {@link Page} de {@link Author}
     */
    Page<Author> findPage(AuthorSearchDto dto);

    /**
     * Método para crear o actualizar un {@link Author}
     *
     * @param id PK de la entidad
     * @param dto datos de la entidad
     */
    void save(Long id, AuthorDto dto);

    /**
     * Método para crear o actualizar un {@link Author}
     *
     * @param id PK de la entidad
     */
    void delete(Long id) throws Exception;
}
