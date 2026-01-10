package com.carManiacs.MainControlSystem.domain.data;

import com.carManiacs.MainControlSystem.domain.enums.ClientType;
import com.carManiacs.MainControlSystem.domain.models.RepairOrder;
import org.springframework.stereotype.Component;

@Component
public class RepairOrderMapper {

    public RepairOrderResponseDto toDto(RepairOrder order) {

        var vehicle = order.getVehicle();
        var client = order.getClient();
        var mechanic = order.getMechanic();

        String clientName = null;
        if (client != null) {
            clientName = client.getClientType() == ClientType.COMPANY
                    ? client.getCompanyName()
                    : client.getFirstName() + " " + client.getLastName();
        }

        String mechanicName = null;
        if (mechanic != null) {
            mechanicName = mechanic.getFirstName() + " " + mechanic.getLastName();
        }

        return new RepairOrderResponseDto(
                order.getId(),
                order.getStatus(),

                order.getReceivedAt(),
                order.getPlannedFinishAt(),
                order.getFinishedAt(),

                vehicle != null ? vehicle.getId() : null,
                vehicle != null ? vehicle.getBrand() : null,
                vehicle != null ? vehicle.getModel() : null,

                client != null ? client.getId() : null,
                clientName,

                mechanic != null ? mechanic.getId() : null,
                mechanicName,

                order.getRental() != null ? order.getRental().getId() : null
        );
    }
}
