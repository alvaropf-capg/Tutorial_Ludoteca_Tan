package com.ccsw.tutorial.game;

import com.ccsw.tutorial.common.criteria.SearchCriteria;
import com.ccsw.tutorial.game.model.Game;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class GameSpecification implements Specification<Game> {

    private static final long serialVersionUID = 1L;

    private final SearchCriteria criteria; //Contiene el campo que se quiere filtrar, tipo de operacion y valor a buscar

    public GameSpecification(SearchCriteria criteria) {
        this.criteria = criteria;   //Guarda el criterio para usarlo despues en toPredicate
    }

    @Override
    public Predicate toPredicate(Root<Game> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        if (criteria.getOperation().equalsIgnoreCase(":") && criteria.getValue() != null) { //la operacion es usada como buscar si hay un valor a filtrar
            Path<String> path = getPath(root); //Obtiene la ruta del atributo busacado
            if (path.getJavaType() == String.class) { //Si el tipo es String usa LIKE
                return builder.like(path, "%" + criteria.getValue() + "%");
            } else {
                return builder.equal(path, criteria.getValue()); //Si NO es String usa equility
            }
        }
        return null;
    }

    private Path<String> getPath(Root<Game> root) { //Nos permite usar filtro en propiedades anidadas gravias al split
        String key = criteria.getKey();
        String[] split = key.split("[.]", 0);

        Path<String> expression = root.get(split[0]);
        for (int i = 1; i < split.length; i++) {
            expression = expression.get(split[i]);
        }

        return expression;
    }

}
