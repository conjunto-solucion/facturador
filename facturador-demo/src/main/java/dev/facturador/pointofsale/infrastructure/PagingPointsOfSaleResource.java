package dev.facturador.pointofsale.infrastructure;

import dev.facturador.global.domain.abstractcomponents.query.PortQueryBus;
import dev.facturador.global.domain.sharedpayload.Page;
import dev.facturador.global.domain.sharedpayload.PagedResponse;
import dev.facturador.pointofsale.domain.PointOfSale;
import dev.facturador.pointofsale.domain.querys.PointOfSaleListQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import static org.springframework.http.ResponseEntity.ok;

/**
 * EndPoint para Listar puntos de venta
 */
@RestController
@RequestMapping(path = "/api/pointsofsale")
public class PagingPointsOfSaleResource {
    private final PortQueryBus queryBus;

    @Autowired
    public PagingPointsOfSaleResource(PortQueryBus queryBus) {
        this.queryBus = queryBus;
    }

    /**
     * Devuelve todos los datos paginados de los {@link PointOfSale} que sean parte
     * de la sucursal solicitante
     *
     * @param index    Número de la página que se está pidiendo
     * @param size     Tamaño de la pagina
     * @param sort     Nombre del atributo sobre el que estarán ordenados los elementos
     * @param order    Decide si el orden debe ser ASC(Ascendente) o DESC(Descendente)
     * @param branchID ID para listar los puntos de venta
     * @return Devuelve el objeto {@link PagedResponse} con los datos de paginacion
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/branches/{IDBranch}")
    public Mono<HttpEntity<PagedResponse<PointOfSale>>> toListPointOfSale(
            @RequestParam(value = "index") int index,
            @RequestParam(value = "size") int size,
            @RequestParam(value = "sort") String sort,
            @RequestParam(value = "order") String order,
            @PathVariable(name = "IDBranch") long branchID)
            throws Exception {

        var query = PointOfSaleListQuery.Builder.getInstance()
                .page(Page.starter(index, size, sort, order))
                .branchId(branchID)
                .build();

        var response = queryBus.handle(query);

        return Mono.just(response).map(r -> ok().body(r));
    }
}
