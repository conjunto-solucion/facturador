package dev.facturador.shared.infrastructure.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.facturador.shared.infrastructure.JWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
public class CustomAuthorizationFilter extends OncePerRequestFilter {
    private JWT<UsernamePasswordAuthenticationToken> jwt;

    public CustomAuthorizationFilter() {
        this.jwt = new JWT<UsernamePasswordAuthenticationToken>() {
            @Override
            public UsernamePasswordAuthenticationToken createUserByToken(String authHeader) {
                final var token = authHeader.substring("Bearer ".length());
                final var decodedJWT = createDecoder(token);
                final var email = decodedJWT.getSubject();
                final var role = getClaimRol(decodedJWT);
                final Collection<SimpleGrantedAuthority> authority =
                        Stream.of(role).map(SimpleGrantedAuthority::new).collect(Collectors.toList());
                return new UsernamePasswordAuthenticationToken(email, null, authority);
            }
        };
    }

    /**
     * Filtro para indicar si se debe autorizar o no al recibir una request
     *
     * @param request     Parametro para agarrar el flujo de la request
     * @param response    Parametro para marcar la respuesta
     * @param filterChain envia la respuesta del filtro con este
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (isNotRequiredAuthorization(request)) {
            filterChain.doFilter(request, response);
        }
        if (isRequiredAuthorization(request)) {
            String authHeader = request.getHeader(AUTHORIZATION);
            if (jwt.verifyToken(authHeader)) {
                try {
                    var authToken = jwt.createUserByToken(authHeader);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                } catch (Exception ex) {
                    log.error("Error logging in: {}", ex.getMessage());
                    response.setHeader("error", ex.getMessage());
                    response.setStatus(FORBIDDEN.value());
                    Map<String, String> error = new HashMap<>();
                    error.put("error-message", ex.getMessage());
                    response.setContentType(APPLICATION_JSON_VALUE);

                    new ObjectMapper().writeValue(response.getOutputStream(), error);
                }
            }
            filterChain.doFilter(request, response);
        }
    }

    private boolean isNotRequiredAuthorization(HttpServletRequest request) {
        return request.getServletPath().equals("/login") || request.getServletPath().equals("/api/auth/login") || request.getServletPath().equals("/api/auth/mainaccounts") || request.getServletPath().equals("/api/auth/refresh");
    }

    private boolean isRequiredAuthorization(HttpServletRequest request) {
        return !request.getServletPath().equals("/login") && !request.getServletPath().equals("/api/auth/login") && !request.getServletPath().equals("/api/auth/mainaccounts") && !request.getServletPath().equals("/api/auth/refresh");
    }

}
