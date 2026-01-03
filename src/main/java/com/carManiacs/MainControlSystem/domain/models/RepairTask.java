package com.carManiacs.MainControlSystem.domain.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "repair_tasks")
@Getter
@Setter
@NoArgsConstructor
public class RepairTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nazwa czynności (np. Wymiana oleju)
     */
    @Column(nullable = false)
    private String name;

    /**
     * Opcjonalny opis
     */
    @Column(length = 1000)
    private String description;

    /**
     * Koszt robocizny dla tej czynności
     */
    @Column(nullable = false)
    private BigDecimal laborCost;

    /**
     * Zlecenie naprawy
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_order_id", nullable = false)
    private RepairOrder repairOrder;
}