package com.carManiacs.MainControlSystem.repositories;

import com.carManiacs.MainControlSystem.domain.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}