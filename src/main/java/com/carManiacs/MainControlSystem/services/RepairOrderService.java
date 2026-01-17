package com.carManiacs.MainControlSystem.services;

import com.carManiacs.MainControlSystem.domain.data.OrderItemRequestDto;
import com.carManiacs.MainControlSystem.domain.enums.EmployeeRole;
import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;
import com.carManiacs.MainControlSystem.domain.models.*;
import com.carManiacs.MainControlSystem.repositories.ClientRepository;
import com.carManiacs.MainControlSystem.repositories.EmployeeRepository;
import com.carManiacs.MainControlSystem.repositories.RepairOrderRepository;
import com.carManiacs.MainControlSystem.repositories.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RepairOrderService {

    private final RepairOrderRepository repairOrderRepository;
    private final VehicleRepository vehicleRepository;
    private final ClientRepository clientRepository;
    private final EmployeeRepository employeeRepository;


    @Transactional(readOnly = true)
    public List<RepairOrder> findAll() {
        return repairOrderRepository.findAll();
    }


    @Transactional(readOnly = true)
    public RepairOrder findById(Long id) {
        return repairOrderRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("RepairOrder not found: " + id)
                );
    }


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
    
    public RepairOrder updateOrder(Long id, String description) {
        RepairOrder order = findById(id);
        order.setDescription(description);
        return order;
    }

    public RepairOrder changeStatus(Long id, RepairStatus status) {
        RepairOrder order = findById(id);
        order.setStatus(status);
        return order;
    }

    public RepairOrder closeRepairOrder(Long id) {
        RepairOrder order = findById(id);
        order.setStatus(RepairStatus.CLOSED);
        return order;
    }

    public void delete(Long id) {
        RepairOrder order = findById(id);
        repairOrderRepository.delete(order);
    }

    @Transactional
    public RepairOrder assignMechanic(Long orderId, Long mechanicId) {

        RepairOrder order = repairOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Zlecenie nie istnieje: " + orderId));

        Employee mechanic = employeeRepository.findById(mechanicId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Mechanik nie istnieje: " + mechanicId));

        if (mechanic.getRole() != EmployeeRole.MECHANIC) {
            throw new IllegalStateException("Pracownik nie jest mechanikiem");
        }

        order.setMechanic(mechanic);
        order.setStatus(RepairStatus.IN_PROGRESS);

        return repairOrderRepository.save(order);
    }

    @Transactional
    public void addTask(Long orderId, OrderItemRequestDto dto) {
        RepairOrder order = getOrder(orderId);

        RepairTask task = new RepairTask();
        task.setDescription(dto.description());
        task.setRepairCost(BigDecimal.valueOf(dto.price()));
        task.setRepairOrder(order);
        task.setName(dto.description());
        order.getTasks().add(task);
    }

    @Transactional
    public void addPart(Long orderId, OrderItemRequestDto dto) {
        RepairOrder order = getOrder(orderId);

        RepairPart part = new RepairPart();
        part.setName(dto.description());
        part.setPartPrice(BigDecimal.valueOf(dto.price()));
        part.setQuantity(dto.quantity());
        part.setRepairOrder(order);

        order.getParts().add(part);
    }

    private RepairOrder getOrder(Long id) {
        return repairOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Zlecenie nie istnieje"));
    }
}
