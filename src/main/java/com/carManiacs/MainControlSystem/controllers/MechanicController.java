package com.carManiacs.MainControlSystem.controllers;

import com.carManiacs.MainControlSystem.domain.data.MechanicWorkloadDto;
import com.carManiacs.MainControlSystem.services.MechanicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mechanics")
@RequiredArgsConstructor
public class MechanicController {

    private final MechanicService mechanicService;

    @GetMapping("/workload")
    public List<MechanicWorkloadDto> getMechanicWorkload() {
        return mechanicService.getMechanicWorkloads();
    }
}
