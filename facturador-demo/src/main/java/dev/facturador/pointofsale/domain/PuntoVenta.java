package dev.facturador.pointofsale.domain;

import dev.facturador.trader.domain.Comerciante;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@SuppressWarnings("ALL")
@Entity
@Table(name = "punto_venta")
@NoArgsConstructor
@Getter
@Setter
@ToString
public final class PuntoVenta implements Serializable {
    public static final Long serialVersinUID = 1L;
    @Id
    @Column(name = "id_punto_venta")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idPointOfSale;

    @Column(name = "direccion", nullable = false, length = 50)
    private String address;

    @Column(name = "email", nullable = false, length = 128)
    private String email;

    @Column(name = "nombre", nullable = false, length = 20)
    private String name;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_comerciante", nullable = false)
    private Comerciante traderOwner;

}