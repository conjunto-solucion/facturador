package dev.facturador.shared.domain;

import java.util.Date;

public record ErrorResponse(Date marcaDeTiempo, String mensaje, String detalles) {
    public ErrorResponse(Date marcaDeTiempo, String mensaje) {
        this(marcaDeTiempo, mensaje, null);
    }
}
