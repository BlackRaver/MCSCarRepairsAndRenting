package com.carManiacs.MainControlSystem.controllers;


import com.carManiacs.MainControlSystem.domain.data.VehicleRequest;
import com.carManiacs.MainControlSystem.domain.models.Vehicle;
import com.carManiacs.MainControlSystem.domain.views.VehicleViews;
import com.carManiacs.MainControlSystem.services.VehicleService;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    /**
     * Lista wszystkich pojazdów
     * Widok: BASIC
     */
    @GetMapping
    @JsonView(VehicleViews.Basic.class)
    public List<Vehicle> getAll() {
        return vehicleService.getAll();
    }

    /**
     * Szczegóły pojazdu
     * Widok: DETAILED
     */
    @GetMapping("/{id}")
    @JsonView(VehicleViews.Detailed.class)
    public Vehicle getById(@PathVariable Long id) {
        return vehicleService.getById(id);
    }

    /**
     * Dodanie nowego pojazdu
     * DTO jako input
     */
    @PostMapping
    public Vehicle create(@Valid @RequestBody VehicleRequest request) {
        return vehicleService.create(request);
    }

    @PutMapping("/{id}")
    public Vehicle update(@PathVariable Long id,
                          @Valid @RequestBody VehicleRequest request) {
        return vehicleService.update(id, request);
    }
}
