package com.carManiacs.MainControlSystem.domain.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "repair_parts")
@Getter
@Setter
@NoArgsConstructor
public class RepairPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nazwa części
     */
    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private Integer quantity;

    /**
     * Cena jednostkowa w momencie naprawy
     */
    @Column(nullable = false)
    private BigDecimal partPrice;

    /**
     * Zlecenie naprawy
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_order_id", nullable = false)
    private RepairOrder repairOrder;
}