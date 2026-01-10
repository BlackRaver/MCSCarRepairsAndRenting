package com.carManiacs.MainControlSystem.services;

import com.carManiacs.MainControlSystem.domain.data.MechanicWorkloadDto;
import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;
import com.carManiacs.MainControlSystem.repositories.RepairOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MechanicService {

    private final RepairOrderRepository repairOrderRepository;

    public List<MechanicWorkloadDto> getMechanicWorkloads() {
        return repairOrderRepository.findMechanicWorkloads(RepairStatus.COMPLETED);
    }
}