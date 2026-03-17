package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.Prestamo.model.PrestamoCreateDto;
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

@Tag(name = "Prestamo", description = "API od Prestamo")
@RequestMapping(value = "/prestamos")
@RestController
@CrossOrigin(origins = "*")
public class PrestamoController {

    @Autowired
    PrestamoService prestamoService;

    @Autowired
    ModelMapper mapper;

    /**
     * Metodo para recuperar un listado paginado de {@link Prestamo}
     *
     * @param dto dto de busqueda
     * @return {@link Page} de {@link PrestamoDto}
     */
    @Operation(summary = "Encontrar pagina", description = "Metodo que devuelve una page de Prestamos")
    @RequestMapping(path = "", method = RequestMethod.POST)
    public Page<PrestamoDto> findPage(
            @RequestBody PrestamoSearchDto dto) { //recibe un json con pageable, gametitle(filtro), clientename(filtro), fechaPrestamoFrom, fechaPrestamoTo(rango de fechas de prestamo), fechaDevolucionFrom, fechaDevolucionTo (rango de fechas de devolucion)

        Page<PrestamoDto> page = this.prestamoService.findPage(dto); //llama al servicio y envia un dto

        return new PageImpl<>(page.getContent() //Obtiene la lista de PrestamoDto
                .stream()   //convierte a stream
                .map(e -> mapper.map(e, PrestamoDto.class)) //Mapea cada elemento
                .collect(Collectors.toList()),  //Convierte stream a List
                page.getPageable(), //Informacion de paginacion
                page.getTotalElements());   //Numero total de elementos
    }

    /**
     * Metodo para crear o actualizar un {@link Prestamo}
     *
     * @param id OK de la entidad
     * @param dto datos de la entidad
     */
    @Operation(summary = "Crear o actualizar", description = "Metodo que crear o actualiza un Prestamo")
    @RequestMapping(path = { "", "/{id}" }, method = RequestMethod.PUT)
    public void save(@PathVariable(name = "id", required = false) Long id, @RequestBody PrestamoCreateDto dto) { //recibe un json con gameId, clienteId, fechaPrestamo y fechaDevolucion

        this.prestamoService.save(id, dto);

    }

    /**
     * Método para crear o actualizar un {@link Prestamo}
     *
     * @param id PK de la entidad
     */
    @Operation(summary = "Eliminar", description = "Metodo que elimina un Prestamo")
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Long id) throws Exception {

        this.prestamoService.delete(id);

    }
}
