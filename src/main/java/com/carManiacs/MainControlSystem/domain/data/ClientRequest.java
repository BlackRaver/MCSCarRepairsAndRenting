package com.carManiacs.MainControlSystem.domain.data;

import com.carManiacs.MainControlSystem.domain.enums.ClientType;
import jakarta.validation.constraints.NotNull;

public record ClientRequest(

        @NotNull
        ClientType clientType,

        String firstName,
        String lastName,

        String companyName,
        String nip
) {
}