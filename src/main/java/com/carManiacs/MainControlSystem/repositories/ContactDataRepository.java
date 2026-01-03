package com.carManiacs.MainControlSystem.repositories;

import com.carManiacs.MainControlSystem.domain.models.ContactData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactDataRepository extends JpaRepository<ContactData, Long> {

    List<ContactData> findAllByClientId(Long clientId);

    void deleteAllByClientId(Long clientId);
}
