package com.ccsw.tutorial.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author ccsw
 *
 */
@Configuration
public class ModelMapperConfig {

    /**
     * ModelMapper se utiliza para mapear obejtos de un tipo a otro
     * Ejemplo: De entidad JPA -> DTO y viceversa
     */

    @Bean //Un bean es un objeto que Spring crea, controla y mantiene dentro de su contenedor de inversion de control (IoC container)
    public ModelMapper getModelMapper() {
        return new ModelMapper();
    }
}
