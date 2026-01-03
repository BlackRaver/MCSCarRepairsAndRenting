package com.carManiacs.MainControlSystem.domain.data;

import com.carManiacs.MainControlSystem.domain.enums.ContactType;
import com.carManiacs.MainControlSystem.domain.models.ContactData;

public record ContactDataDto(
        Long id,
        ContactType type,
        String contactValue
) {
    public static ContactDataDto from(ContactData c) {
        return new ContactDataDto(c.getId(), c.getType(), c.getContactValue() );
    }
}