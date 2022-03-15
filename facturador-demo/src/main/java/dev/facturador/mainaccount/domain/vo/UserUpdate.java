package dev.facturador.mainaccount.domain.vo;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotEmpty;

public record UserUpdate(
        @NotEmpty @Length(min = 3, max = 20) String username,
        @NotEmpty @Length(min = 3, max = 20) String newUsername,
        @NotEmpty @Length(min = 8, max = 40) String password,
        @NotEmpty @Length(min = 8, max = 40) String newPassword,
        String avatar
) {}
