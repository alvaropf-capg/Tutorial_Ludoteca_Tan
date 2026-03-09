package com.ccsw.tutorial.Cliente;

import com.ccsw.tutorial.Cliente.Model.Cliente;
import org.springframework.data.repository.CrudRepository;

/**
 * @author alperezf
 */
public interface ClienteRepository extends CrudRepository<Cliente, Long> {
}
