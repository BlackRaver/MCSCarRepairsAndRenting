package com.carManiacs.MainControlSystem.repositories;

import com.carManiacs.MainControlSystem.domain.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {
}