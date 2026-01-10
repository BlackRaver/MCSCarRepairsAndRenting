package com.carManiacs.MainControlSystem.services;

import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;
import com.carManiacs.MainControlSystem.domain.models.Client;
import com.carManiacs.MainControlSystem.domain.models.RepairOrder;
import com.carManiacs.MainControlSystem.domain.models.Vehicle;
import com.carManiacs.MainControlSystem.repositories.ClientRepository;
import com.carManiacs.MainControlSystem.repositories.RepairOrderRepository;
import com.carManiacs.MainControlSystem.repositories.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RepairOrderService {

    private final RepairOrderRepository repairOrderRepository;
    private final VehicleRepository vehicleRepository;
    private final ClientRepository clientRepository;

    // =========================
    // LISTA ZLECEŃ
    // =========================
    @Transactional(readOnly = true)
    public List<RepairOrder> findAll() {
        return repairOrderRepository.findAll();
    }

    // =========================
    // SZCZEGÓŁY ZLECENIA
    // =========================
    @Transactional(readOnly = true)
    public RepairOrder findById(Long id) {
        return repairOrderRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("RepairOrder not found: " + id)
                );
    }

    // =========================
    // UTWORZENIE ZLECENIA
    // =========================
    public RepairOrder createRepairOrder(
            Long vehicleId,
            Long clientId,
            Boolean replacementCar
    ) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Vehicle not found: " + vehicleId)
                );

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Client not found: " + clientId)
                );

        RepairOrder order = new RepairOrder();
        order.setVehicle(vehicle);
        order.setClient(client);
        order.setStatus(RepairStatus.CREATED);
        order.setReceivedAt(LocalDateTime.now());
        order.setRental(null);

        return repairOrderRepository.save(order);
    }

    // =========================
    // EDYCJA ZLECENIA (opis)
    // =========================
    public RepairOrder updateOrder(Long id, String description) {
        RepairOrder order = findById(id);
        order.setDescription(description);
        return order;
    }

    // =========================
    // ZMIANA STATUSU
    // =========================
    public RepairOrder changeStatus(Long id, RepairStatus status) {
        RepairOrder order = findById(id);
        order.setStatus(status);
        return order;
    }

    // =========================
    // ZAMKNIĘCIE ZLECENIA
    // =========================
    public RepairOrder closeRepairOrder(Long id) {
        RepairOrder order = findById(id);
        order.setStatus(RepairStatus.CLOSED);
        return order;
    }

    // =========================
    // USUNIĘCIE (ADMIN)
    // =========================
    public void delete(Long id) {
        RepairOrder order = findById(id);
        repairOrderRepository.delete(order);
    }
}
