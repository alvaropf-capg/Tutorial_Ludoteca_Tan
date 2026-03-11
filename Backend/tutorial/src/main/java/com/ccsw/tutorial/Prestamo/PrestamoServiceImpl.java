package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.Prestamo.model.PrestamoDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoSearchDto;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

/**
 * @author alperezf
 */
@Service
@Transactional
public class PrestamoServiceImpl implements PrestamoService {

    @Autowired
    PrestamoRepository prestamoRepository;

    /**
     * {@inheritDoc}
     */
    @Override
    public Page<Prestamo> findPage(PrestamoSearchDto dto) { //recibe los filtros enviados desde el front

        //Filtro que busca por id de cliente
        PrestamoSpecification clienteSpec = new PrestamoSpecification(new SearchCriteria("cliente.id", ":", dto.getIdCliente()));

        //Filtro por id de juego
        PrestamoSpecification gameSpec = new PrestamoSpecification(new SearchCriteria("game.id", ":", dto.getIdGame()));

        //Filtro por fecha de prestamo >= fecha de inicio
        PrestamoSpecification fechaInicioSpec = new PrestamoSpecification(new SearchCriteria("fechaPrestamo", ">=", dto.getFechaInicio()));

        //Filtro por fecha de prestamos <= fecha de finalizacion
        PrestamoSpecification fechaFinSpec = new PrestamoSpecification(new SearchCriteria("fechaPrestamo", "<=", dto.getFechaFin()));

        //Une todos los filtros
        Specification<Prestamo> spec = clienteSpec.and(gameSpec).and(fechaInicioSpec).and(fechaFinSpec);

        return this.prestamoRepository.findAll(spec, dto.getPageable().getPageable());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void save(Long id, PrestamoDto data) {
        Prestamo prestamo;

        //Si el id es null crea un prestamo, pero si el id existe actualiza ese prestamo
        if (id == null) {
            prestamo = new Prestamo();
        } else {
            prestamo = this.prestamoRepository.findById(id).orElse(null);
        }

        BeanUtils.copyProperties(data, prestamo, "id", "game", "cliente", "fechaPrestamo"); //Copia todos los atributos menos los que estan entre ""

        this.prestamoRepository.save(prestamo);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void delete(Long id) throws Exception {

        if (this.prestamoRepository.findById(id).orElse(null) == null) { //verifica si existe
            throw new Exception("Not exists");
        }

        this.prestamoRepository.deleteById(id);
    }
}
