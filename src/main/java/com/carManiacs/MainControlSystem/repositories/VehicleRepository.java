package com.carManiacs.MainControlSystem.repositories;

import com.carManiacs.MainControlSystem.domain.enums.VehicleType;
import com.carManiacs.MainControlSystem.domain.models.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository
        extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findFirstByVehicleTypeAndAvailableTrue(VehicleType vehicleType);

    boolean existsByVin(String vin);

}