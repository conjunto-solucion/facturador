package dev.facturador.repository;

import dev.facturador.entities.CuentaSecundaria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ICuentaSecundariaRepository extends JpaRepository<CuentaSecundaria, Long> {

    @Query(value = "FROM CuentaSecundaria sa WHERE sa.userSecondaryAccount.username = :username")
    Optional<CuentaSecundaria> findByUsername(@Param("username") String username);
}