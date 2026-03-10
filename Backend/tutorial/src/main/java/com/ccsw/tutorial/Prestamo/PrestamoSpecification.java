package com.ccsw.tutorial.Prestamo;

import com.ccsw.tutorial.Prestamo.model.Prestamo;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class PrestamoSpecification implements Specification<Prestamo> {
    private static final long serialVersionUID = 1L;
    private final SearchCriteria criteria;

    public PrestamoSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<Prestamo> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        if (criteria.getValue() == null)
            return null;

        Path<?> path = getPath(root, criteria.getKey());

        switch (criteria.getOperation()) {
        case ":":
            if (path.getJavaType() == String.class) {
                return cb.like(cb.lower(path.as(String.class)), "%" + criteria.getValue().toString().toLowerCase() + "%");
            } else {
                return cb.equal(path, criteria.getValue());
            }
        case ">=":
            return cb.greaterThanOrEqualTo(path.as(Comparable.class), (Comparable) criteria.getValue());
        case "<=":
            return cb.lessThanOrEqualTo(path.as(Comparable.class), (Comparable) criteria.getValue());
        case "null":
            // value=true -> IS NULL ; value=false -> IS NOT NULL
            return Boolean.TRUE.equals(criteria.getValue()) ? cb.isNull(path) : cb.isNotNull(path);
        default:
            return null;
        }
    }

    private Path<?> getPath(Root<Prestamo> root, String key) {
        String[] split = key.split("[.]", 0);
        Path<?> expression = root.get(split[0]);
        for (int i = 1; i < split.length; i++) {
            expression = expression.get(split[i]);
        }
        return expression;
    }
}
