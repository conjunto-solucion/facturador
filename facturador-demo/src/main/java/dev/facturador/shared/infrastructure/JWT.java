package dev.facturador.shared.infrastructure;

import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.StringUtils;

import javax.xml.bind.DatatypeConverter;
import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;

public interface JWT<T> {
    String secrectKey = "$argon2id$v=19$m=2048,t=2,p=1$F7XsIVx3YSVL6tGdyeGyrA$dLXD9Clq4po8/dL6b0IudGmgGyr+4cHNTM4fjqG5LDw";
    long expDateDefined = 14400000;

    T createUserByToken(String authHeader);

    default Boolean verifyToken(String auth) {
        return Boolean.TRUE.equals(StringUtils.hasText(auth) && auth.startsWith("Bearer "));
    }

    default String createAccesToken(String email, Collection<? extends GrantedAuthority> rol, String url) {
        return com.auth0.jwt.JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + expDateDefined))
                .withIssuer(url)
                .withClaim("role", rol.stream().toList().get(0).getAuthority())
                .sign(signKey());
    }

    default String createRefreshToken(String email, String url) {
        return com.auth0.jwt.JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + expDateDefined + 259200000))
                .withIssuer(url)
                .sign(signKey());
    }

    default Algorithm signKey() {
        return Algorithm.HMAC256(DatatypeConverter.parseBase64Binary(secrectKey));
    }

    default DecodedJWT createDecoder(String token) {
        return com.auth0.jwt.JWT.require(this.signKey()).build().verify(token);
    }

    default String getClaimRol(DecodedJWT decodedJWT) {
        return decodedJWT.getClaim("role").asString();
    }
}
