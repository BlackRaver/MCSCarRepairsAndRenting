package com.carManiacs.MainControlSystem.controllers;

import com.carManiacs.MainControlSystem.domain.data.MechanicWorkloadDto;
import com.carManiacs.MainControlSystem.domain.models.Employee;
import com.carManiacs.MainControlSystem.domain.views.EmployeeViews;
import com.carManiacs.MainControlSystem.services.EmployeeService;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;


    @GetMapping
    @JsonView(EmployeeViews.Basic.class)
    public List<Employee> getEmployees() {
        return employeeService.getAll();
    }

    @GetMapping("/workload")
    public List<MechanicWorkloadDto> getMechanicWorkload() {
        return employeeService.getMechanicWorkloads();
    }

    @PostMapping
    @JsonView(EmployeeViews.Basic.class)
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.create(employee);
    }

    @PutMapping("/{id}")
    @JsonView(EmployeeViews.Basic.class)
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee
    ) {
        return employeeService.update(id, employee);
    }

}
