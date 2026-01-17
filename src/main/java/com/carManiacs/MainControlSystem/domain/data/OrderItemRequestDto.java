

package com.carManiacs.MainControlSystem.domain.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderItemRequestDto(

        @NotBlank
        String description,

        @NotNull
        @Positive
        Double price,

        Integer quantity
) {}