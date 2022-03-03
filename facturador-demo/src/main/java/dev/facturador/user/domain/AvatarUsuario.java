package dev.facturador.user.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "avatar_usuario")
@NoArgsConstructor
@Getter
@Setter
@ToString
public final class AvatarUsuario {
    @Id
    @Column(name = "id_avatar")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userAvatarId;

    @Column(name = "avatar", nullable = false)
    private String avatar;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuarios usuario;

    public AvatarUsuario(String avatar, Usuarios usuario) {
        this.avatar = avatar;
        this.usuario = usuario;
    }
}