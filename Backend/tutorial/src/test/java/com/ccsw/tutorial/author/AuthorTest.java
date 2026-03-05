package com.ccsw.tutorial.author;

import com.ccsw.tutorial.author.model.Author;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthorTest {

    public static final Long EXISTS_AUTHOR_ID = 1L;
    public static final Long NOT_EXISTS_AUTHOR_ID = 0L;

    @Mock
    private AuthorRepository authorRepository;

    @InjectMocks
    private AuthorServiceImpl authorService;

    @Test
    public void getExistsAuthorIdShouldReturnAuthor() {
        Author author = mock(Author.class); //Crea un mock de Author
        when(author.getId()).thenReturn(EXISTS_AUTHOR_ID);  //Si alguien llama a author.getId() devolvera EXISTS_AUTHOR_ID
        when(authorRepository.findById(EXISTS_AUTHOR_ID)).thenReturn(Optional.of(author)); //Simulacion de que el repository encuantra ese autor (no accede a la BD)

        Author authorResponse = authorService.get(EXISTS_AUTHOR_ID); //Llama al service y mira si funciona bien

        assertNotNull(authorResponse); //Asegura que no devuelve null

        assertEquals(EXISTS_AUTHOR_ID, authorResponse.getId()); //Comprueba que el id concide
    }

    @Test
    public void getNotExistsAuthorIdShouldReturnNull() {
        when(authorRepository.findById(NOT_EXISTS_AUTHOR_ID)).thenReturn(Optional.empty()); //Simula que el autor no existe

        Author author = authorService.get(NOT_EXISTS_AUTHOR_ID); //llama al service

        assertNull(author); //comprueba que es null
    }

}
