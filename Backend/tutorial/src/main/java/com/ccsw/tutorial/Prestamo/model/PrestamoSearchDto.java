package com.ccsw.tutorial.Prestamo.model;

import com.ccsw.tutorial.common.pagination.PageableRequest;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class PrestamoSearchDto {

    private PageableRequest pageable;

    private String titulo;
    private String clienteNombre;
    private LocalDate fecha;

    public PageableRequest getPageable() {
        return pageable;
    }

    public void setPageable(PageableRequest pageable) {
        this.pageable = pageable;
    }
}
