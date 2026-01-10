package com.carManiacs.MainControlSystem.controllers;

import com.carManiacs.MainControlSystem.domain.data.CreateRepairOrderRequest;
import com.carManiacs.MainControlSystem.domain.data.UpdateRepairOrderRequest;
import com.carManiacs.MainControlSystem.domain.data.RepairOrderMapper;
import com.carManiacs.MainControlSystem.domain.data.RepairOrderResponseDto;
import com.carManiacs.MainControlSystem.domain.models.RepairOrder;
import com.carManiacs.MainControlSystem.services.RepairOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class RepairOrderController {

    private final RepairOrderService repairOrderService;
    private final RepairOrderMapper repairOrderMapper;

    // =========================
    // LISTA ZLECEŃ
    // GET /api/repair-orders
    // =========================
    @GetMapping
    public List<RepairOrderResponseDto> getAll() {
        return repairOrderService.findAll()
                .stream()
                .map(repairOrderMapper::toDto)
                .toList();
    }

    // =========================
    // SZCZEGÓŁY ZLECENIA
    // GET /api/repair-orders/{id}
    // =========================
    @GetMapping("/{id}")
    public RepairOrderResponseDto getById(@PathVariable Long id) {
        RepairOrder order = repairOrderService.findById(id);
        return repairOrderMapper.toDto(order);
    }

    // =========================
    // UTWORZENIE ZLECENIA
    // POST /api/repair-orders
    // =========================
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

    // =========================
    // EDYCJA ZLECENIA (opis)
    // PUT /api/repair-orders/{id}
    // =========================
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

    // =========================
    // USUNIĘCIE ZLECENIA (ADMIN)
    // DELETE /api/repair-orders/{id}
    // =========================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repairOrderService.delete(id);
    }
}
