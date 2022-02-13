package dev.facturador.repository;

import dev.facturador.entities.CuentaPrincipal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ICuentaPrincipalRepository extends JpaRepository<CuentaPrincipal, Long> {

    @Query(value = "FROM CuentaPrincipal am WHERE am.userMainAccount.username = :username")
    Optional<CuentaPrincipal> findByUsername(@Param("username") String username);
}
