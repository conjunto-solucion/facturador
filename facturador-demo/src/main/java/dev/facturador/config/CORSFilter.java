package dev.facturador.config;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Filtro para el Cors
 */
@Component
public class CORSFilter implements Filter {
    /**
     * Metodo init necesario para el ciiclo de vida del filtro
     * Se ejecuta antes del contructor de CORSFilter (No necesito que haga nada)
     * @param filterConfig
     * @throws ServletException
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws ServletException, IOException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE, PATCH");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        response.setHeader("Access-Control-Expose-Headers", "Location");
        filterChain.doFilter(servletRequest, servletResponse);
    }

    /**
     * Necesario para el cilo de vida de CORSFilter
     * Se ejecuta despues de dejar de utilizar la clase y nuevamente no necesito que haga nada
     */
    @Override
    public void destroy() {
    }
}