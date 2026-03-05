package com.ccsw.tutorial.game;

import com.ccsw.tutorial.game.model.Game;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * @author ccsw
 */
public interface GameRepository extends CrudRepository<Game, Long>, JpaSpecificationExecutor<Game> {

    /**
     *Para evitar tantas consultas, le decimos a Spring que queremos que haga una unica con consulta y las sub.consultas mediante join correspondiente
     *
     */
    @Override
    @EntityGraph(attributePaths = { "category", "author" })
    List<Game> findAll(Specification<Game> spec);
}
