package com.carManiacs.MainControlSystem.domain.models;

import com.carManiacs.MainControlSystem.domain.enums.EmployeeRole;
import com.carManiacs.MainControlSystem.domain.views.EmployeeViews;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(EmployeeViews.Basic.class)
    private Long id;

    @Column(nullable = false)
    @JsonView(EmployeeViews.Basic.class)
    private String firstName;

    @Column(nullable = false)
    @JsonView(EmployeeViews.Basic.class)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JsonView(EmployeeViews.Basic.class)
    private EmployeeRole role;

    @Column(nullable = false)
    @JsonView(EmployeeViews.Basic.class)
    private Boolean active = true;
}