package com.carManiacs.MainControlSystem.domain.models;

import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "repair_orders")
@Getter
@Setter
@NoArgsConstructor
public class RepairOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Status naprawy
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepairStatus status;

    /**
     * Opis zgłoszonego problemu / uwagi
     */
    @Column(length = 1000)
    private String description;

    /**
     * Data przyjęcia pojazdu
     */
    @Column(nullable = false)
    private LocalDateTime receivedAt;

    /**
     * Planowana data zakończenia
     */
    private LocalDateTime plannedFinishAt;

    /**
     * Faktyczna data zakończenia
     */
    private LocalDateTime finishedAt;

    /**
     * Klient, który zlecił naprawę (snapshot)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    /**
     * Naprawiany pojazd
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @OneToMany(
            mappedBy = "repairOrder",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RepairTask> tasks = new ArrayList<>();

    @OneToMany(
            mappedBy = "repairOrder",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RepairPart> parts = new ArrayList<>();

    /**
     * Mechanik odpowiedzialny za naprawę
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mechanic_id")
    private Employee mechanic;

    /**
     * Wynajem auta zastępczego (opcjonalnie)
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_id")
    private Rental rental;
}