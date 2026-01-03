package com.carManiacs.MainControlSystem.controllers;

import com.carManiacs.MainControlSystem.domain.data.ClientRequest;
import com.carManiacs.MainControlSystem.domain.data.ContactDataDto;
import com.carManiacs.MainControlSystem.domain.data.ContactDataRequest;
import com.carManiacs.MainControlSystem.domain.models.Client;
import com.carManiacs.MainControlSystem.domain.views.ClientViews;
import com.carManiacs.MainControlSystem.services.ClientService;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    // ===== GET ALL =====
    @GetMapping
    @JsonView(ClientViews.Basic.class)
    public List<Client> getAll() {
        return clientService.getAll();
    }

    // ===== GET BY ID =====
    @GetMapping("/{id}")
    @JsonView(ClientViews.Detailed.class)
    public Client getById(@PathVariable Long id) {
        return clientService.getById(id);
    }

    // ===== CREATE =====
    @PostMapping
    public Client create(@Valid @RequestBody ClientRequest request) {
        return clientService.create(request);
    }

    // ===== UPDATE =====
    @PutMapping("/{id}")
    public Client update(@PathVariable Long id,
                         @Valid @RequestBody ClientRequest request) {
        return clientService.update(id, request);
    }

    // ===== DELETE =====
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clientService.delete(id);
    }

    // ===== CONTACTS =====

    @GetMapping("/{id}/contacts")
    public List<ContactDataDto> getContacts(@PathVariable Long id) {
        return clientService.getContacts(id);
    }

    @PutMapping("/{id}/contacts")
    public List<ContactDataDto> updateContacts(
            @PathVariable Long id,
            @RequestBody List<ContactDataRequest> contacts) {

        return clientService.updateContacts(id, contacts);
    }
}