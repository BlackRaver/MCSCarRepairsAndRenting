package com.carManiacs.MainControlSystem.domain.data;

import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;

import java.time.LocalDateTime;

public record RepairOrderResponseDto(

        Long id,
        RepairStatus status,

        LocalDateTime receivedAt,
        LocalDateTime plannedFinishAt,
        LocalDateTime finishedAt,

        Long vehicleId,
        String vehicleBrand,
        String vehicleModel,

        Long clientId,
        String clientName,

        Long mechanicId,
        String mechanicName,

        Long rentalId

) {}