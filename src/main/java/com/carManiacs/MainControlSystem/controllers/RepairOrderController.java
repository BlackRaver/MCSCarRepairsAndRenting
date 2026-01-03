package com.carManiacs.MainControlSystem.controllers;

import com.carManiacs.MainControlSystem.domain.data.CreateRepairOrderRequest;
import com.carManiacs.MainControlSystem.domain.data.RepairOrderMapper;
import com.carManiacs.MainControlSystem.domain.data.RepairOrderResponseDto;
import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;
import com.carManiacs.MainControlSystem.domain.models.RepairOrder;
import com.carManiacs.MainControlSystem.services.RepairOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repair-orders")
@RequiredArgsConstructor
public class RepairOrderController {

    private final RepairOrderService repairOrderService;
    private final RepairOrderMapper repairOrderMapper;

    @PostMapping
    public RepairOrderResponseDto create(
            @RequestBody CreateRepairOrderRequest request) {

        RepairOrder order = repairOrderService.createRepairOrder(
                request.vehicleId(),
                request.clientId(),
                request.replacementCar()
        );

        return repairOrderMapper.toDto(order);
    }

    @PostMapping("/{id}/mechanic/{mechanicId}")
    public RepairOrderResponseDto assignMechanic(
            @PathVariable Long id,
            @PathVariable Long mechanicId) {

        return repairOrderMapper.toDto(
                repairOrderService.assignMechanic(id, mechanicId)
        );
    }

    @PostMapping("/{id}/status")
    public RepairOrderResponseDto changeStatus(
            @PathVariable Long id,
            @RequestParam RepairStatus status) {

        return repairOrderMapper.toDto(
                repairOrderService.changeStatus(id, status)
        );
    }

    @PostMapping("/{id}/close")
    public RepairOrderResponseDto close(@PathVariable Long id) {

        return repairOrderMapper.toDto(
                repairOrderService.closeRepairOrder(id)
        );
    }
}