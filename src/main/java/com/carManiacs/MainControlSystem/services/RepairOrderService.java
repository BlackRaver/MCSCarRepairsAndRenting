package com.carManiacs.MainControlSystem.services;

import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;
import com.carManiacs.MainControlSystem.domain.enums.VehicleType;
import com.carManiacs.MainControlSystem.domain.models.*;
import com.carManiacs.MainControlSystem.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class RepairOrderService {

    private final RepairOrderRepository repairOrderRepository;
    private final VehicleRepository vehicleRepository;
    private final ClientRepository clientRepository;
    private final EmployeeRepository employeeRepository;
    private final RentalRepository rentalRepository;

    public RepairOrder createRepairOrder(
            Long vehicleId,
            Long clientId,
            boolean withReplacementCar) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        RepairOrder order = new RepairOrder();
        order.setVehicle(vehicle);
        order.setClient(client);
        order.setStatus(RepairStatus.CREATED);
        order.setReceivedAt(LocalDateTime.now());

        repairOrderRepository.save(order);

        if (withReplacementCar) {
            createRental(order, client);
        }

        return order;
    }

    public RepairOrder assignMechanic(Long orderId, Long mechanicId) {
        RepairOrder order = repairOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        Employee mechanic = employeeRepository.findById(mechanicId)
                .orElseThrow(() -> new IllegalArgumentException("Mechanic not found"));

        order.setMechanic(mechanic);
        return order;
    }

    public RepairOrder changeStatus(Long orderId, RepairStatus status) {
        RepairOrder order = repairOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setStatus(status);
        return order;
    }

    public RepairOrder closeRepairOrder(Long orderId) {
        RepairOrder order = repairOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setStatus(RepairStatus.CLOSED);
        order.setFinishedAt(LocalDateTime.now());

        closeRental(order);

        return order;
    }

    private void createRental(RepairOrder order, Client client) {
        Vehicle replacementCar = vehicleRepository.findFirstByVehicleTypeAndAvailableTrue(
                VehicleType.RENTER
        ).orElseThrow(() -> new IllegalStateException("No replacement cars available"));

        Rental rental = new Rental();
        rental.setVehicle(replacementCar);
        rental.setClient(client);
        rental.setRepairOrder(order);
        rental.setStartDate(LocalDateTime.now());
        rental.setDailyRate(BigDecimal.valueOf(100));

        replacementCar.setAvailable(false);

        rentalRepository.save(rental);
        order.setRental(rental);
    }

    private void closeRental(RepairOrder order) {
        Rental rental = order.getRental();
        if (rental != null) {
            rental.setEndDate(LocalDateTime.now());
            rental.getVehicle().setAvailable(true);
        }
    }
}
