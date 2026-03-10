package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.Prestamo.model.PrestamoDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoSearchDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

/**
 * @author alperezf
 */

@Tag(name = "Prestamos", description = "API de Prestamo")
@RequestMapping(value = "/prestamos")
@RestController
@CrossOrigin(origins = "*")
public class PrestamoController {

    @Autowired
    PrestamoService prestamoService;

    @Autowired
    ModelMapper mapper;

    /**
     * Metodo para listar paginado de {@link Prestamo}
     */
    @Operation(summary = "Find page", description = "Method that return a page of Prestamos")
    @RequestMapping(path = "", method = RequestMethod.POST)
    public Page<PrestamoDto> findPage(@RequestBody PrestamoSearchDto dto) {
        Page<Prestamo> page = this.prestamoService.findPage(dto);
        return new PageImpl<>(page.getContent().stream().map(e -> mapper.map(e, PrestamoDto.class)).collect(Collectors.toList()), page.getPageable(), page.getTotalElements());
    }

    /**
     * Metodo para crear o actualizar un {@link Prestamo}
     *
     * @param id PK de la entidad
     * @param dto datos de la entidad
     */
    @Operation(summary = "Crear o Actualizar", description = "Metodo que crea o actualiza un Prestamo")
    @RequestMapping(path = { "", "/{id}" }, method = RequestMethod.PUT)
    public void save(@PathVariable(name = "id", required = false) Long id, @RequestBody PrestamoDto dto) {
        this.prestamoService.save(id, dto);
    }

    /**
     * Método eliminar {@link Prestamo}
     *
     * @param id PK de la entidad
     */
    @Operation(summary = "Eliminar", description = "Metodo que elimina un Prestamo")
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Long id) throws Exception {
        this.prestamoService.delete(id);
    }

}
