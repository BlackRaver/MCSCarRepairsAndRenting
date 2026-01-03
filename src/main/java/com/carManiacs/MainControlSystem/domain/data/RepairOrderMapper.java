package com.carManiacs.MainControlSystem.domain.data;

import com.carManiacs.MainControlSystem.domain.models.RepairOrder;
import org.springframework.stereotype.Component;

@Component
public class RepairOrderMapper {

    public RepairOrderResponseDto toDto(RepairOrder order) {
        return new RepairOrderResponseDto(
                order.getId(),
                order.getStatus(),
                order.getReceivedAt(),
                order.getPlannedFinishAt(),
                order.getFinishedAt(),
                order.getVehicle().getId(),
                order.getClient().getId(),
                order.getMechanic() != null ? order.getMechanic().getId() : null,
                order.getRental() != null ? order.getRental().getId() : null
        );
    }
}