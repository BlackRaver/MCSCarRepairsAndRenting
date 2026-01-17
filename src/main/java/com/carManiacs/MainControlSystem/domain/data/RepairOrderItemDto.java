package com.carManiacs.MainControlSystem.domain.data;

import java.math.BigDecimal;

public record RepairOrderItemDto(
        String type,        // TASK | PART
        String name,
        Integer quantity,
        BigDecimal cost
) {}