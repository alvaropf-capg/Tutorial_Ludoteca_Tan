package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Cliente.ClienteRepository;
import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.Prestamo.model.PrestamoCreateDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoSearchDto;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import com.ccsw.tutorial.game.GameRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 * @author alperezf
 */

@Service
@Transactional
public class PrestamoServiceImpl implements PrestamoService {

    @Autowired
    PrestamoRepository prestamoRepository;

    @Autowired
    GameRepository gameRepository;

    @Autowired
    ClienteRepository clienteRepository;

    // busqueda por filtros
    @Override
    public Page<PrestamoDto> findPage(PrestamoSearchDto dto) {

        Specification<Prestamo> spec = null; //Creamos specification vacia

        if (dto.getGameTitle() != null && !dto.getGameTitle().isEmpty()) {
            Specification<Prestamo> s = new PrestamoSpecification(new SearchCriteria("game.title", ":", dto.getGameTitle())); //aplicamos filtro
            spec = (spec == null) ? s : spec.and(s);
        }

        if (dto.getClienteName() != null && !dto.getClienteName().isEmpty()) {
            Specification<Prestamo> s = new PrestamoSpecification(new SearchCriteria("cliente.name", ":", dto.getClienteName()));
            spec = (spec == null) ? s : spec.and(s);
        }

        if (dto.getFechaPrestamoFrom() != null) {
            Specification<Prestamo> s = new PrestamoSpecification(new SearchCriteria("fechaPrestamo", ">=", dto.getFechaPrestamoFrom()));
            spec = (spec == null) ? s : spec.and(s);
        }

        if (dto.getFechaPrestamoTo() != null) {
            Specification<Prestamo> s = new PrestamoSpecification(new SearchCriteria("fechaPrestamo", "<=", dto.getFechaPrestamoTo()));
            spec = (spec == null) ? s : spec.and(s);
        }

        if (dto.getFechaDevolucionFrom() != null) {
            Specification<Prestamo> s = new PrestamoSpecification(new SearchCriteria("fechaDevolucion", ">=", dto.getFechaDevolucionFrom()));
            spec = (spec == null) ? s : spec.and(s);
        }

        if (dto.getFechaDevolucionTo() != null) {
            Specification<Prestamo> s = new PrestamoSpecification(new SearchCriteria("fechaDevolucion", "<=", dto.getFechaDevolucionTo()));
            spec = (spec == null) ? s : spec.and(s);
        }

        Page<Prestamo> page = (spec == null) ? prestamoRepository.findAll(dto.getPageable().getPageable()) : prestamoRepository.findAll(spec, dto.getPageable().getPageable());

        //Si no hay filtros usa un finall(pageable), si hay filtros utiliza un findall(spec, pageable)

        return page.map(this::convertToDto); //convierte las entidades a dtos
    }

    // mapear entidad
    private PrestamoDto convertToDto(Prestamo p) {
        PrestamoDto dto = new PrestamoDto();
        dto.setId(p.getId());
        dto.setNombreGame(p.getGame().getTitle());
        dto.setNombreCliente(p.getCliente().getName());
        dto.setFechaPrestamo(p.getFechaPrestamo().toString());
        if (p.getFechaDevolucion() != null)
            dto.setFechaDevolucion(p.getFechaDevolucion().toString());
        return dto;
    }

    @Override
    public void save(Long id, PrestamoCreateDto dto) {

        //procesar fechas
        LocalDate inicio = dto.getFechaPrestamo();
        LocalDate fin = (dto.getFechaDevolucion() != null) ? dto.getFechaDevolucion() : inicio;
        //VALIDACIONES
        // el juego no puede solaparse con otro prestamo del mismo

        Specification<Prestamo> specJuego = Specification.allOf(PrestamoSpecification.overlaps(inicio, fin), PrestamoSpecification.sameGame(dto.getGameId()), PrestamoSpecification.excludeId(id));

        if (prestamoRepository.count(specJuego) > 0)
            throw new IllegalArgumentException("El juego ya está prestado en ese rango de fechas.");

        // no mas de 2 prestamos por cliente
        Specification<Prestamo> specCliente = Specification.allOf(PrestamoSpecification.overlaps(inicio, fin), PrestamoSpecification.sameCliente(dto.getClienteId()), PrestamoSpecification.excludeId(id));

        if (prestamoRepository.count(specCliente) >= 2)
            throw new IllegalArgumentException("El cliente ya tiene 2 préstamos activos en ese rango.");

        // crear o actualizarel prestamo
        Prestamo prestamo = (id == null) ? new Prestamo() : prestamoRepository.findById(id).orElseThrow();

        //asignar juego, cliente y fecha
        prestamo.setGame(gameRepository.findById(dto.getGameId()).orElseThrow());
        prestamo.setCliente(clienteRepository.findById(dto.getClienteId()).orElseThrow());
        prestamo.setFechaPrestamo(dto.getFechaPrestamo());
        prestamo.setFechaDevolucion(dto.getFechaDevolucion());

        //guradar prestamo
        prestamoRepository.save(prestamo);
    }

    // elimnar prestamo
    @Override
    public void delete(Long id) throws Exception {
        prestamoRepository.deleteById(id);
    }
}