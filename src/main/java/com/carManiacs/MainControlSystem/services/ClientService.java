package com.carManiacs.MainControlSystem.services;

import com.carManiacs.MainControlSystem.domain.data.ClientRequest;
import com.carManiacs.MainControlSystem.domain.models.Client;
import com.carManiacs.MainControlSystem.repositories.ClientRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<Client> getAll() {
        return clientRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Client getById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Client not found"));
    }

    public Client create(ClientRequest request) {

        Client client = new Client();
        client.setClientType(request.clientType());

        switch (request.clientType()) {

            case PERSON -> {
                if (request.firstName() == null || request.lastName() == null) {
                    throw new IllegalArgumentException(
                            "PERSON client requires firstName and lastName");
                }

                client.setFirstName(request.firstName());
                client.setLastName(request.lastName());
                client.setCompanyName(null);
                client.setNip(null);
            }

            case COMPANY -> {
                if (request.companyName() == null || request.nip() == null) {
                    throw new IllegalArgumentException(
                            "COMPANY client requires companyName and NIP");
                }

                client.setCompanyName(request.companyName());
                client.setNip(request.nip());
                client.setFirstName(null);
                client.setLastName(null);
            }
        }

        return clientRepository.save(client);
    }

    public Client update(Long id, ClientRequest request) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Client not found"));

        client.setClientType(request.clientType());
        client.setFirstName(request.firstName());
        client.setLastName(request.lastName());

        return client;
    }

    public void delete(Long id) {
        clientRepository.deleteById(id);
    }
}