package com.carManiacs.MainControlSystem.domain.data;

import com.carManiacs.MainControlSystem.domain.enums.VehicleType;
import org.antlr.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.Size;

public record VehicleRequest(

        @NotBlank
        @Size(max = 17)
        String vin,

        @NotBlank
        String brand,

        @NotBlank
        String model,

        Integer productionYear,

        @NotNull
        VehicleType vehicleType,

        Long clientId
) {
}