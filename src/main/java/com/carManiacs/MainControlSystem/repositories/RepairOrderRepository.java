package com.carManiacs.MainControlSystem.repositories;

import com.carManiacs.MainControlSystem.domain.models.RepairOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepairOrderRepository
        extends JpaRepository<RepairOrder, Long> {
}