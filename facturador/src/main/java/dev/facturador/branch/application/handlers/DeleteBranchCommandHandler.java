package dev.facturador.branch.application.handlers;

import dev.facturador.branch.application.BranchRepository;
import dev.facturador.branch.domain.command.BranchDeleteCommand;
import dev.facturador.global.domain.abstractcomponents.command.PortCommandHandler;
import dev.facturador.security.domain.exception.ResourceNotFound;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Manejador del comando {@link BranchDeleteCommand}
 */
@AllArgsConstructor
@Service
@Transactional
public class DeleteBranchCommandHandler implements PortCommandHandler<BranchDeleteCommand> {
    @Autowired
    private final BranchRepository repository;

    /**
     * Maneja la eliminacion de sucursales
     *
     * @param command Contiene los datos para eliminar una sucursal
     * @throws ResourceNotFound
     */
    @Override
    public void handle(BranchDeleteCommand command) throws ResourceNotFound {
        var branch =repository.findById(command.getBranchId());
        //Si existe le sede la eliminacion al caso de uso
        if (branch.isEmpty()) throw new ResourceNotFound("Esta sucursal no existe");

        repository.delete(branch.get());
    }
}
