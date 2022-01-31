package dev.facturador.entities;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "detalles_cuenta")
@NoArgsConstructor @Getter @Setter @ToString
public class DetallesCuenta {

    @Id
    @Column(name = "id_detalles_cuenta")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAccountDetails;

    @Column(nullable = false, length = 30, unique = true)
    private String username;

    @Column(nullable = false, length = 128)
    private String password;

    @Column(nullable = false, length = 320, unique = true)
    private String  email;
}