package dev.facturador.exceptions;

import dev.facturador.dto.ErrorDetailsDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.*;
import java.util.*;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

/**
 * Clase para manejar las excepciones
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Maneja la excepcion de tipo ConstraintViolationException
     * @param ex Recibe la excepcion ConstraintViolationException
     * @return Retorna el dto ErrorDetails y envia codigo 400
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorDetailsDto> handler(ConstraintViolationException ex){
        ErrorDetailsDto errorDetalles = new ErrorDetailsDto(new Date(), ex.getMessage(), String.valueOf(ex.getCause()));
        return new ResponseEntity<>(errorDetalles, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja una excepcion generica si no se maneja la excepcion especifica que se envia entra aqui
     * @param exception Recibe la excepcion
     * @param webRequest Intercepta la request
     * @return Retorna el dto ErrorDetails y envia codigo 400
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetailsDto> manejarGlobalException(Exception exception, WebRequest webRequest){
        ErrorDetailsDto errorDetalles = new ErrorDetailsDto(new Date(),exception.getMessage(), webRequest.getDescription(false));
        return new ResponseEntity<>(errorDetalles, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja la excepcion MethodArgumentNotValidException
     * @param ex Recupera la excepcion MethodArgumentNotValidException
     * @param headers Indica que recibe el header de la request
     * @param status Indica que recibe el estado actual
     * @param request Intercepta la request con WebRequest
     * @return Retorna la respuesta y el estado de 400
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid
            (MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String name = ((FieldError)error).getField();
            String message = error.getDefaultMessage();
            errores.put(name, message);
        });
        return new ResponseEntity<>(errores,HttpStatus.BAD_REQUEST);
    }
}