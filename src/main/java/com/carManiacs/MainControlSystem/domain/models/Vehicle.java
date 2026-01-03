package com.carManiacs.MainControlSystem.domain.models;

import com.carManiacs.MainControlSystem.domain.enums.VehicleType;
import com.carManiacs.MainControlSystem.domain.views.VehicleViews;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "vehicles",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "vin")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(VehicleViews.Basic.class)
    private Long id;

    @Column(nullable = false, unique = true, length = 17)
    @JsonView(VehicleViews.Basic.class)
    private String vin;

    @JsonView(VehicleViews.Detailed.class)
    private String registrationNumber;

    @Column(nullable = false)
    @JsonView(VehicleViews.Basic.class)
    private String brand;

    @Column(nullable = false)
    @JsonView(VehicleViews.Basic.class)
    private String model;

    @JsonView(VehicleViews.Basic.class)
    private Integer productionYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JsonView(VehicleViews.Basic.class)
    private VehicleType vehicleType;

    @JsonView(VehicleViews.Detailed.class)
    private Boolean available;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    @JsonView(VehicleViews.Basic.class)
    private Client client;

}