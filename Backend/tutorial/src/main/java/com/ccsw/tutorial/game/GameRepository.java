package com.ccsw.tutorial.game;

import com.ccsw.tutorial.game.model.Game;
import org.springframework.data.repository.CrudRepository;

/**
 * @author ccsw
 */
public interface GameRepository extends CrudRepository<Game, Long> {
}
