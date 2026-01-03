package com.carManiacs.MainControlSystem.domain.models;

import com.carManiacs.MainControlSystem.domain.enums.ClientType;
import com.carManiacs.MainControlSystem.domain.views.ClientViews;
import com.carManiacs.MainControlSystem.domain.views.VehicleViews;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.service.registry.HttpServiceGroup;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Table(
        name = "clients",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "nip")
        }
)
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView({ClientViews.Basic.class,VehicleViews.Basic.class})
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JsonView(ClientViews.Basic.class)
    private ClientType clientType;

    @JsonView({ClientViews.Basic.class,VehicleViews.Basic.class})
    private String firstName;

    @JsonView({ClientViews.Basic.class,VehicleViews.Basic.class})
    private String lastName;

    @JsonView({ClientViews.Basic.class,VehicleViews.Basic.class})
    private String companyName;

    @JsonView(ClientViews.Basic.class)
    private String nip;

    @OneToMany(
            mappedBy = "client",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonView(ClientViews.Detailed.class)
    private List<ContactData> contactData = new ArrayList<>();

}
