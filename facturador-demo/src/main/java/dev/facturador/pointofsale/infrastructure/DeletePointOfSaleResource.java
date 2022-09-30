package dev.facturador.pointofsale.infrastructure;

import dev.facturador.global.domain.abstractcomponents.command.PortCommandBus;
import dev.facturador.global.domain.abstractcomponents.query.PortQueryBus;
import dev.facturador.pointofsale.domain.commands.PointOfSaleDeleteCommand;
import dev.facturador.pointofsale.domain.subdomain.ControlOfPosGetQuery;
import dev.facturador.pointofsale.domain.subdomain.ControlOfPosUpdateCommand;
import dev.facturador.pointofsale.domain.subdomain.RequiredPosControlData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * EndPoint para eliminar puntos de venta
 */
@RestController
@RequestMapping(path = "/api/pointsofsale")
public class DeletePointOfSaleResource {
    private final PortCommandBus portCommandBus;
    private final PortQueryBus portQueryBus;

    @Autowired
    public DeletePointOfSaleResource(PortCommandBus portCommandBus, PortQueryBus portQueryBus) {
        this.portCommandBus = portCommandBus;
        this.portQueryBus = portQueryBus;
    }

    /**
     * Se encarga de eliminar un punto de venta
     * Si la eliminacion es exitosa actualiza el control del punto de venta
     * Al trader al que le perteneció el punto de venta borrado
     *
     * @param IDPointOfSale ID del punto de venta ha eliminar
     * @param IDTrader      ID al que le pertenece el punto de venta
     * @return Estado 204 no content
     */
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{IDPointOfSale}/trader/{IDTrader}")
    public HttpEntity<Void> deletePointOfSale(@PathVariable(name = "IDPointOfSale") long IDPointOfSale,
                                              @PathVariable(name = "IDTrader") long IDTrader)
            throws Exception {

        var command = PointOfSaleDeleteCommand.Builder.getInstance()
                .pointOfSaleId(IDPointOfSale).build();
        this.portCommandBus.handle(command);

        var query = ControlOfPosGetQuery.Builder.getInstance()
                .traderID(IDTrader).build();
        var control = portQueryBus.handle(query);

        var commandForControl = ControlOfPosUpdateCommand.Builder.getInstance()
                .data(RequiredPosControlData.starter(control.getPointsOfSaleControlId(), control.getCurrentCount(), control.getTotalCount(), false)).build();
        this.portCommandBus.handle(commandForControl);

        return ResponseEntity.noContent().build();
    }
}
