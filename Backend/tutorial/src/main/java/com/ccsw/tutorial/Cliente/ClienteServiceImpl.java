package com.ccsw.tutorial.Cliente;

import com.ccsw.tutorial.Cliente.Model.Cliente;
import com.ccsw.tutorial.Cliente.Model.ClienteDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author alperezf
 *
 */
@Service
@Transactional
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    ClienteRepository clienteRepository;

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Cliente> findAll() {
        return (List<Cliente>) this.clienteRepository.findAll();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void save(Long id, ClienteDto dto) {
        Cliente cliente;

        if (id == null) {
            cliente = new Cliente();
        } else {
            cliente = this.clienteRepository.findById(id).orElse(null);
        }

        cliente.setName(dto.getName().toLowerCase());
        this.clienteRepository.save(cliente);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void delete(Long id) throws Exception {

        if (this.clienteRepository.findById(id).orElse(null) == null) {
            throw new Exception("Not exists");
        }

        this.clienteRepository.deleteById(id);
    }

}
