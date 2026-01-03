package com.carManiacs.MainControlSystem.domain.models;

import com.carManiacs.MainControlSystem.domain.enums.ContactType;
import com.carManiacs.MainControlSystem.domain.views.ClientViews;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "contact_data")
public class ContactData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(ClientViews.Detailed.class)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JsonView(ClientViews.Detailed.class)
    private ContactType type;

    @Column(nullable = false)
    @JsonView(ClientViews.Detailed.class)
    private String contactValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

}
