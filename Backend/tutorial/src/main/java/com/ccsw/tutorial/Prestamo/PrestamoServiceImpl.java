package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Cliente.ClienteRepository;
import com.ccsw.tutorial.Cliente.ClienteService;
import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.Prestamo.model.PrestamoCreateDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoDto;
import com.ccsw.tutorial.Prestamo.model.PrestamoSearchDto;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import com.ccsw.tutorial.game.GameRepository;
import com.ccsw.tutorial.game.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

/**
 * @author alperezf
 */
public class PrestamoServiceImpl implements PrestamoService {

    @Autowired
    PrestamoRepository prestamoRepository;

    @Autowired
    GameRepository gameRepository;

    @Autowired
    ClienteRepository clienteRepository;

    @Autowired
    GameService gameService;

    @Autowired
    ClienteService clienteService;

    /**
     * {@inheritDoc}
     */
    @Override
    public Page<PrestamoDto> findPage(PrestamoSearchDto dto) {

        Specification<Prestamo> spec = null;

        // FILTRO POR TÍTULO DEL JUEGO
        if (dto.getGameTitle() != null && !dto.getGameTitle().isEmpty()) {
            Specification<Prestamo> tituloSpec = new PrestamoSpecification(new SearchCriteria("game.title", ":", dto.getGameTitle()));
            spec = (spec == null) ? tituloSpec : spec.and(tituloSpec);
        }

        // FILTRO POR NOMBRE DEL CLIENTE
        if (dto.getClienteName() != null && !dto.getClienteName().isEmpty()) {
            Specification<Prestamo> clienteSpec = new PrestamoSpecification(new SearchCriteria("cliente.name", ":", dto.getClienteName()));
            spec = (spec == null) ? clienteSpec : spec.and(clienteSpec);
        }

        // FILTRO POR RANGO DE FECHA DE PRÉSTAMO
        if (dto.getFechaPrestamoFrom() != null) {
            Specification<Prestamo> fechaFromSpec = new PrestamoSpecification(new SearchCriteria("fechaPrestamo", ">=", dto.getFechaPrestamoFrom()));
            spec = (spec == null) ? fechaFromSpec : spec.and(fechaFromSpec);
        }

        if (dto.getFechaPrestamoTo() != null) {
            Specification<Prestamo> fechaToSpec = new PrestamoSpecification(new SearchCriteria("fechaPrestamo", "<=", dto.getFechaPrestamoTo()));
            spec = (spec == null) ? fechaToSpec : spec.and(fechaToSpec);
        }

        // FILTRO POR RANGO DE FECHA DE DEVOLUCIÓN
        if (dto.getFechaDevolucionFrom() != null) {
            Specification<Prestamo> fechaDevFromSpec = new PrestamoSpecification(new SearchCriteria("fechaDevolucion", ">=", dto.getFechaDevolucionFrom()));
            spec = (spec == null) ? fechaDevFromSpec : spec.and(fechaDevFromSpec);
        }

        if (dto.getFechaDevolucionTo() != null) {
            Specification<Prestamo> fechaDevToSpec = new PrestamoSpecification(new SearchCriteria("fechaDevolucion", "<=", dto.getFechaDevolucionTo()));
            spec = (spec == null) ? fechaDevToSpec : spec.and(fechaDevToSpec);
        }

        Page<Prestamo> page;
        if (spec != null) {
            page = this.prestamoRepository.findAll(spec, dto.getPageable().getPageable());
        } else {
            // Si no hay filtros, simplemente busca todos
            page = this.prestamoRepository.findAll(dto.getPageable().getPageable());
        }
        return page.map(this::convertToDto);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void save(Long id, PrestamoCreateDto data) {

        validatePrestamo(data);

        Prestamo prestamo;

        if (id == null) {
            prestamo = new Prestamo();
        } else {
            prestamo = this.prestamoRepository.findById(id).orElse(null);
        }

        prestamo.setGame(gameRepository.findById(data.getGameId()).get());
        prestamo.setCliente(clienteRepository.findById(data.getClienteId()).get());
        prestamo.setFechaPrestamo(data.getFechaPrestamo());
        prestamo.setFechaDevolucion(data.getFechaDevolucion());

        this.prestamoRepository.save(prestamo);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void delete(Long id) throws Exception {
        Prestamo prestamo = this.prestamoRepository.findById(id).orElse(null);

        if (prestamo == null) {
            throw new Exception("Prestamo not exists");
        }

        this.prestamoRepository.deleteById(id);
    }

    /**
     * Convierte una entidad Prestamo a PrestamoDto
     */
    private PrestamoDto convertToDto(Prestamo prestamo) {
        PrestamoDto dto = new PrestamoDto();
        dto.setId(prestamo.getId());
        dto.setNombreGame(prestamo.getGame().getTitle());           // ← Cambiar a getTitle()
        dto.setNombreCliente(prestamo.getCliente().getName());
        dto.setFechaPrestamo(prestamo.getFechaPrestamo());
        dto.setFechaDevolucion(prestamo.getFechaDevolucion());
        return dto;
    }

    /**
     * Valida reglas de negocio del Prestamo
     */
    private void validatePrestamo(PrestamoCreateDto dto) {

        // Validación 1: Game es obligatorio
        if (dto.getGameId() == null) {
            throw new IllegalArgumentException("El juego es obligatorio");
        }

        // Validación 2: Cliente es obligatorio
        if (dto.getClienteId() == null) {
            throw new IllegalArgumentException("El cliente es obligatorio");
        }

        // Validación 3: Fecha préstamo es obligatoria
        if (dto.getFechaPrestamo() == null) {
            throw new IllegalArgumentException("La fecha de préstamo es obligatoria");
        }

        // Validación 4: Fecha préstamo no puede ser en el futuro
        if (dto.getFechaPrestamo().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de préstamo no puede ser en el futuro");
        }

        // Validación 5: Si hay fecha devolución, debe ser después o igual a la de préstamo
        if (dto.getFechaDevolucion() != null && dto.getFechaDevolucion().isBefore(dto.getFechaPrestamo())) {
            throw new IllegalArgumentException("La fecha de devolución debe ser posterior o igual a la de préstamo");
        }

        // Validación 6: El juego no puede tener otro préstamo activo sin devolver
        // (Esto dependerá de tu lógica de negocio)
    }
}
