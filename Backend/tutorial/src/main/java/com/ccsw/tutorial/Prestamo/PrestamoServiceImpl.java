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

        Specification<Prestamo> spec = null;

        // FILTRO POR TÍTULO DEL JUEGO
        if (dto.getTitulo() != null && !dto.getTitulo().isEmpty()) {
            Specification<Prestamo> tituloSpec = new PrestamoSpecification(new SearchCriteria("game.title", ":", dto.getTitulo()));

            spec = (spec == null) ? tituloSpec : spec.and(tituloSpec);
        }

        // FILTRO POR NOMBRE DEL CLIENTE
        if (dto.getClienteNombre() != null && !dto.getClienteNombre().isEmpty()) {
            Specification<Prestamo> clienteSpec = new PrestamoSpecification(new SearchCriteria("cliente.name", ":", dto.getClienteNombre()));

            spec = (spec == null) ? clienteSpec : spec.and(clienteSpec);
        }

        // FILTRO POR FECHA INTERMEDIA (DÍA EN RANGO)
        if (dto.getFecha() != null) {

            // fechaPrestamo <= fecha
            Specification<Prestamo> inicioSpec = new PrestamoSpecification(new SearchCriteria("fechaPrestamo", "<=", dto.getFecha()));

            // fechaDevolucion >= fecha
            Specification<Prestamo> finSpec = new PrestamoSpecification(new SearchCriteria("fechaDevolucion", ">=", dto.getFecha()));

            spec = (spec == null) ? inicioSpec : spec.and(inicioSpec);
            spec = spec.and(finSpec);
        }

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

        BeanUtils.copyProperties(data, prestamo, "id", "game", "cliente"); //Copia todos los atributos menos los que estan entre ""

        prestamo.setGame(data.getGame());
        prestamo.setCliente(data.getCliente());
        prestamo.setFechaPrestamo(data.getFechaPrestamo());

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
