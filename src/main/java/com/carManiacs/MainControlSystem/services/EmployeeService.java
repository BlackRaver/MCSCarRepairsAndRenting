package com.carManiacs.MainControlSystem.services;

import com.carManiacs.MainControlSystem.domain.data.MechanicWorkloadDto;
import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;
import com.carManiacs.MainControlSystem.domain.models.Employee;
import com.carManiacs.MainControlSystem.repositories.EmployeeRepository;
import com.carManiacs.MainControlSystem.repositories.RepairOrderRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final RepairOrderRepository repairOrderRepository;

    public List<MechanicWorkloadDto> getMechanicWorkloads() {
        return repairOrderRepository.findMechanicWorkloads(RepairStatus.COMPLETED);
    }

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }


    public Employee create(Employee employee) {
        employee.setId(null); // bezpieczeństwo
        return employeeRepository.save(employee);
    }

    public Employee update(Long id, Employee data) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existing.setFirstName(data.getFirstName());
        existing.setLastName(data.getLastName());
        existing.setRole(data.getRole());

        return employeeRepository.save(existing);
    }


}