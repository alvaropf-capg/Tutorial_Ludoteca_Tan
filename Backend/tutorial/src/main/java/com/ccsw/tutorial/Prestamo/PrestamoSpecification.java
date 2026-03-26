package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

/**
 * @author alperezf
 */
public class PrestamoSpecification implements Specification<Prestamo> {

    private static final long serialVersionUID = 1L;
    private final SearchCriteria criteria;

    public PrestamoSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    // filtrado
    @Override
    public Predicate toPredicate(Root<Prestamo> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        if (criteria.getOperation().equalsIgnoreCase(":")) {
            if (criteria.getValue() != null) {
                Path<String> path = getPath(root);
                if (path.getJavaType() == String.class) {
                    return builder.like(builder.lower(path), "%" + criteria.getValue().toString().toLowerCase() + "%");
                } else {
                    return builder.equal(path, criteria.getValue());
                }
            }
        } else if (criteria.getOperation().equalsIgnoreCase(">=")) {
            return builder.greaterThanOrEqualTo(getPathComparable(root), (Comparable) criteria.getValue());
        } else if (criteria.getOperation().equalsIgnoreCase("<=")) {
            return builder.lessThanOrEqualTo(getPathComparable(root), (Comparable) criteria.getValue());
        }

        return null;
    }

    //para navegar por campos anidados
    private Path<String> getPath(Root<Prestamo> root) {
        String key = criteria.getKey();
        String[] split = key.split("[.]", 0);
        Path<String> expression = root.get(split[0]);
        for (int i = 1; i < split.length; i++) {
            expression = expression.get(split[i]);
        }
        return expression;
    }

    private Path<Comparable> getPathComparable(Root<Prestamo> root) {
        String key = criteria.getKey();
        String[] split = key.split("[.]", 0);
        Path<Comparable> expression = root.get(split[0]);
        for (int i = 1; i < split.length; i++) {
            expression = expression.get(split[i]);
        }
        return expression;
    }

    //Validaciones
    //detectar solapamientos
    public static Specification<Prestamo> overlaps(LocalDate start, LocalDate end) {
        return (root, query, cb) -> cb.and(cb.lessThanOrEqualTo(root.get("fechaPrestamo"), end), cb.greaterThanOrEqualTo(root.get("fechaDevolucion"), start));
    }

    //detecta si el jeugo esta ocupado
    public static Specification<Prestamo> sameGame(Long gameId) {
        return (root, query, cb) -> cb.equal(root.get("game").get("id"), gameId);
    }

    //lo mismo que el anterior pero con cliente
    public static Specification<Prestamo> sameCliente(Long clienteId) {
        return (root, query, cb) -> cb.equal(root.get("cliente").get("id"), clienteId);
    }

    //se excluye a si mismo
    public static Specification<Prestamo> excludeId(Long id) {
        return (root, query, cb) -> {
            if (id == null)
                return cb.conjunction();
            return cb.notEqual(root.get("id"), id);
        };
    }
}