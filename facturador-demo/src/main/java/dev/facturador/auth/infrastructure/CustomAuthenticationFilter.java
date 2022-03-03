package dev.facturador.auth.infrastructure;

import dev.facturador.auth.application.JWTOfAuth;
import dev.facturador.auth.domain.CustomUserDetails;
import dev.facturador.shared.infrastructure.JWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JWT<UsernamePasswordAuthenticationToken> jwt;

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
        this.jwt = new JWTOfAuth();
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        String usernameOrEmail = request.getParameter("usernameOrEmail");
        String password = request.getParameter("password");
        var authenticationToken = new UsernamePasswordAuthenticationToken(usernameOrEmail, password);
        return this.authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void successfulAuthentication
            (HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        var user = (CustomUserDetails) authResult.getPrincipal();
        var URL = request.getRequestURI().toString();
        String accesToken = jwt.createAccesToken(user.getUsername(), user.getAuthorities().stream().toList().get(0).getAuthority(), URL);
        String refreshToken = jwt.createRefreshToken(user.getUsername(), user.getAuthorities().stream().toList().get(0).getAuthority(), URL);
        response.setHeader("Access-token", accesToken);
        response.setHeader("Refresh-token", refreshToken);
        response.addHeader("user-data", user.getUsername());
        response.addHeader("user-data", user.getAuthorities().stream().toList().get(0).getAuthority());
        response.addHeader("user-data", String.valueOf(user.getActive()));
        response.addHeader("user-data", String.valueOf(user.getPassive()));
    }

}