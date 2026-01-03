package com.carManiacs.MainControlSystem.domain.data;

public record CreateRepairOrderRequest(
        Long vehicleId,
        Long clientId,
        boolean replacementCar
) {
}