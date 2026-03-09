package com.ccsw.tutorial.Cliente;

import com.ccsw.tutorial.Cliente.Model.Cliente;
import com.ccsw.tutorial.Cliente.Model.ClienteDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author alperezf
 */

@Tag(name = "Cliente", description = "API of Cliente")
@RequestMapping(value = "/cliente")
@RestController
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    ClienteService clienteService;

    @Autowired
    ModelMapper mapper;

    /**
     * Metodo lista clientes
     *
     * @return {@list List} de {@link ClienteDto}
     */
    @Operation(summary = "Lista de Clientes", description = "Devuelve lista de clientes")
    @RequestMapping(path = "", method = RequestMethod.GET)
    public List<ClienteDto> findAll() {

        List<Cliente> clientes = this.clienteService.findAll();
        return clientes.stream().map(e -> mapper.map(e, ClienteDto.class)).collect(Collectors.toList());
    }

    /**
     * Metodo para crear o actualizar los clientes
     *
     * @param id PK de la entidad
     * @param dto datos de la entidad
     */
    @Operation(summary = "Crear o Actualizar", description = "Metodo para crear o actualizar un cliente")
    @RequestMapping(path = { "", "/{id}" }, method = RequestMethod.PUT)
    public void save(@PathVariable(name = "id", required = false) Long id, @RequestBody ClienteDto dto) {

        this.clienteService.save(id, dto);
    }

    /**
     * Metodo borrar cliente
     *
     * @param id PK de la entidad
     */
    @Operation(summary = "Borrar", description = "Metodo para borrar clientes")
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Long id) throws Exception {

        this.clienteService.delete(id);
    }

}
