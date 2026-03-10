package com.ccsw.tutorial.Prestamo.model;

import com.ccsw.tutorial.common.pagination.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class PrestamoSearchDto {

    private PageableRequest pageable;

    private Long idCliente;
    private Long idGame;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    public PageableRequest getPageable() {
        return pageable;
    }

    public void setPageable(PageableRequest pageable) {
        this.pageable = pageable;
    }
}
