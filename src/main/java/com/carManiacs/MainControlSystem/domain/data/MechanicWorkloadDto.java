package com.carManiacs.MainControlSystem.domain.data;

public record MechanicWorkloadDto(
        Long mechanicId,
        String mechanicName,
        long activeOrdersCount
) {}