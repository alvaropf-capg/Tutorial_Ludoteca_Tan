package com.ccsw.tutorial.Cliente;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author alperezf
 */

@Tag(name = "Cliente", description = "API of Cliente")
@RequestMapping(value = "/cliente")
@RestController
@CrossOrigin(origins = "*")
public class ClienteController {

    /**
     * Método para probar el servicio
     *
     */
    @RequestMapping(path = "", method = RequestMethod.GET)
    public String prueba() {

        return "Probando el Controller";
    }
    
}
