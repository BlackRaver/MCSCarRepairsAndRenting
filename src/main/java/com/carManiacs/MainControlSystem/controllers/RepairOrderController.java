package com.carManiacs.MainControlSystem.controllers;

import com.carManiacs.MainControlSystem.domain.data.*;
import com.carManiacs.MainControlSystem.domain.models.RepairOrder;
import com.carManiacs.MainControlSystem.services.RepairOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class RepairOrderController {

    private final RepairOrderService repairOrderService;
    private final RepairOrderMapper repairOrderMapper;

    @GetMapping
    public List<RepairOrderResponseDto> getAll() {
        return repairOrderService.findAll()
                .stream()
                .map(repairOrderMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public RepairOrderResponseDto getById(@PathVariable Long id) {
        RepairOrder order = repairOrderService.findById(id);
        return repairOrderMapper.toDto(order);
    }

    @PostMapping
    public RepairOrderResponseDto create(
            @RequestBody CreateRepairOrderRequest request
    ) {
        RepairOrder order = repairOrderService.createRepairOrder(
                request.vehicleId(),
                request.clientId(),
                request.replacementCar()
        );

        return repairOrderMapper.toDto(order);
    }

    @PutMapping("/{id}")
    public RepairOrderResponseDto update(
            @PathVariable Long id,
            @RequestBody UpdateRepairOrderRequest request
    ) {
        RepairOrder updated = repairOrderService.updateOrder(
                id,
                request.description()
        );

        return repairOrderMapper.toDto(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repairOrderService.delete(id);
    }

    @PostMapping("/{orderId}/mechanic/{mechanicId}")
    public RepairOrderResponseDto assignMechanic(
            @PathVariable Long orderId,
            @PathVariable Long mechanicId
    ) {
        RepairOrder order = repairOrderService.assignMechanic(orderId, mechanicId);
        return repairOrderMapper.toDto(order);
    }

    @PostMapping("/{orderId}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public void addTask(
            @PathVariable Long orderId,
            @RequestBody @Valid OrderItemRequestDto dto
    ) {
        repairOrderService.addTask(orderId, dto);
    }

    @PostMapping("/{orderId}/parts")
    @ResponseStatus(HttpStatus.CREATED)
    public void addPart(
            @PathVariable Long orderId,
            @RequestBody @Valid OrderItemRequestDto dto
    ) {
        repairOrderService.addPart(orderId, dto);
    }
}
