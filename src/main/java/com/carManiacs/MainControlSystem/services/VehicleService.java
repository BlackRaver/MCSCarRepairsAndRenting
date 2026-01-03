package com.carManiacs.MainControlSystem.services;


import com.carManiacs.MainControlSystem.domain.data.VehicleRequest;
import com.carManiacs.MainControlSystem.domain.enums.VehicleType;
import com.carManiacs.MainControlSystem.domain.models.Client;
import com.carManiacs.MainControlSystem.domain.models.Vehicle;
import com.carManiacs.MainControlSystem.repositories.ClientRepository;
import com.carManiacs.MainControlSystem.repositories.VehicleRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ClientRepository clientRepository;

    /**
     * Pobranie wszystkich pojazdów
     */
    @Transactional(readOnly = true)
    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    /**
     * Pobranie pojazdu po ID
     */
    @Transactional(readOnly = true)
    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Vehicle not found"));
    }

    /**
     * Utworzenie nowego pojazdu
     */
    public Vehicle create(VehicleRequest request) {

        if (vehicleRepository.existsByVin(request.vin())) {
            throw new IllegalArgumentException("Vehicle with this VIN already exists");
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setVin(request.vin());
        vehicle.setBrand(request.brand());
        vehicle.setModel(request.model());
        vehicle.setProductionYear(request.productionYear());
        vehicle.setVehicleType(request.vehicleType());


        if (request.vehicleType() == VehicleType.RENTER) {

            vehicle.setAvailable(true);
            vehicle.setClient(null);

        } else {
            if (request.clientId() == null) {
                throw new IllegalArgumentException(
                        "Client vehicle must have clientId");
            }

            Client client = clientRepository.findById(request.clientId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Client not found"));

            vehicle.setClient(client);
            vehicle.setAvailable(null);
        }

        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(Long id, VehicleRequest request) {

        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Vehicle not found"));

        if (!vehicle.getVin().equals(request.vin())
                && vehicleRepository.existsByVin(request.vin())) {
            throw new IllegalArgumentException("Vehicle with this VIN already exists");
        }

        vehicle.setVin(request.vin());
        vehicle.setBrand(request.brand());
        vehicle.setModel(request.model());
        vehicle.setProductionYear(request.productionYear());
        vehicle.setVehicleType(request.vehicleType());

        if (request.vehicleType() == VehicleType.RENTER) {

            vehicle.setClient(null);

            if (vehicle.getAvailable() == null) {
                vehicle.setAvailable(true);
            }

        } else {
            if (request.clientId() == null) {
                throw new IllegalArgumentException(
                        "Client vehicle must have clientId");
            }

            Client client = clientRepository.findById(request.clientId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Client not found"));

            vehicle.setClient(client);
            vehicle.setAvailable(null);
        }

        return vehicle;
    }

}
