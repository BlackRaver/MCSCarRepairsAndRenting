package com.carManiacs.MainControlSystem.repositories;

import com.carManiacs.MainControlSystem.domain.models.Rental;
import com.carManiacs.MainControlSystem.domain.models.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalRepository
        extends JpaRepository<Rental, Long> {

    boolean existsByVehicleAndEndDateIsNull(Vehicle vehicle);
}