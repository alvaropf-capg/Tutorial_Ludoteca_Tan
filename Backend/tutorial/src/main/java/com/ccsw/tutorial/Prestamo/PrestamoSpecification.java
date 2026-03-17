package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

/**
 * @author alperezf
 */
public class PrestamoSpecification implements Specification<Prestamo> {

    private static final long serialVersionUID = 1L;

    private final SearchCriteria criteria;

    public PrestamoSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<Prestamo> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        if (criteria.getOperation().equalsIgnoreCase(":")) {
            // Operación LIKE (igualdad para strings)
            if (criteria.getValue() != null) {
                Path<String> path = getPath(root);
                if (path.getJavaType() == String.class) {
                    return builder.like(builder.lower(path), "%" + criteria.getValue().toString().toLowerCase() + "%");
                } else {
                    return builder.equal(path, criteria.getValue());
                }
            }
        } else if (criteria.getOperation().equalsIgnoreCase(">=")) {
            // Mayor o igual (para fechas)
            return builder.greaterThanOrEqualTo(getPathComparable(root), (Comparable) criteria.getValue());
        } else if (criteria.getOperation().equalsIgnoreCase("<=")) {
            // Menor o igual (para fechas)
            return builder.lessThanOrEqualTo(getPathComparable(root), (Comparable) criteria.getValue());
        }

        return null;
    }

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
}
