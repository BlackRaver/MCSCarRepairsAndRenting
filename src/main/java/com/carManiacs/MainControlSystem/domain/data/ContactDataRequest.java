package com.carManiacs.MainControlSystem.domain.data;

import com.carManiacs.MainControlSystem.domain.enums.ContactType;

public record ContactDataRequest(
        Long id,
        ContactType type,
        String contactValue
) {}