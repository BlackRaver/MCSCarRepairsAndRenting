package com.carManiacs.MainControlSystem.domain.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rentals")
@Getter
@Setter
@NoArgsConstructor
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Samochód zastępczy (tylko RENTER)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    /**
     * Klient, który wynajął auto
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    /**
     * Kontekst biznesowy – zlecenie naprawy
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_order_id", unique = true)
    private RepairOrder repairOrder;

    /**
     * Data rozpoczęcia wynajmu
     */
    @Column(nullable = false)
    private LocalDateTime startDate;

    /**
     * Data zakończenia wynajmu
     * null = wynajem aktywny
     */
    private LocalDateTime endDate;

    /**
     * Cena za dzień wynajmu
     */
    @Column(nullable = false)
    private BigDecimal dailyRate;

    /**
     * Kaucja (opcjonalnie)
     */
    private BigDecimal deposit;
}