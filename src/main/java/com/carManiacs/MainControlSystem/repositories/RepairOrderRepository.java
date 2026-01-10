package com.carManiacs.MainControlSystem.repositories;

import com.carManiacs.MainControlSystem.domain.data.MechanicWorkloadDto;
import com.carManiacs.MainControlSystem.domain.enums.RepairStatus;
import com.carManiacs.MainControlSystem.domain.models.RepairOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RepairOrderRepository
        extends JpaRepository<RepairOrder, Long> {

    @Query("""
    select new com.carManiacs.MainControlSystem.domain.data.MechanicWorkloadDto(
        m.id,
        concat(m.firstName, ' ', m.lastName),
        count(ro)
    )
    from Employee m
    left join RepairOrder ro
        on ro.mechanic = m
        and ro.status <> :completedStatus
    where m.role = com.carManiacs.MainControlSystem.domain.enums.EmployeeRole.MECHANIC
    group by m.id, m.firstName, m.lastName
""")
    List<MechanicWorkloadDto> findMechanicWorkloads(
            @Param("completedStatus") RepairStatus completedStatus
    );

}