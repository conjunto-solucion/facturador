package dev.facturador.mainaccount.domain.exception;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@ToString
@EqualsAndHashCode
@Getter
@AllArgsConstructor
public class ErrorInDataForUpdate extends Exception {
    private String errorInUpdate;
}
