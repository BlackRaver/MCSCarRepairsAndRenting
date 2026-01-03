package com.carManiacs.MainControlSystem.services;

import com.carManiacs.MainControlSystem.domain.data.ClientRequest;
import com.carManiacs.MainControlSystem.domain.data.ContactDataDto;
import com.carManiacs.MainControlSystem.domain.data.ContactDataRequest;
import com.carManiacs.MainControlSystem.domain.models.Client;
import com.carManiacs.MainControlSystem.domain.models.ContactData;
import com.carManiacs.MainControlSystem.repositories.ClientRepository;

import com.carManiacs.MainControlSystem.repositories.ContactDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;

    private final ContactDataRepository contactDataRepository;

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

    @Transactional(readOnly = true)
    public List<ContactDataDto> getContacts(Long clientId) {
        return contactDataRepository.findAllByClientId(clientId).stream()
                .map(ContactDataDto::from)
                .toList();
    }

    @Transactional
    public List<ContactDataDto> updateContacts(
            Long clientId,
            List<ContactDataRequest> requests) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        List<ContactData> existing = contactDataRepository
                .findAllByClientId(clientId);

        Map<Long, ContactData> existingMap = existing.stream()
                .collect(Collectors.toMap(ContactData::getId, Function.identity()));

        Set<Long> receivedIds = new HashSet<>();

        List<ContactData> result = new ArrayList<>();

        for (ContactDataRequest req : requests) {

            if (req.id() != null) {
                ContactData contact = existingMap.get(req.id());
                if (contact == null) {
                    throw new RuntimeException("Invalid contact id");
                }
                contact.setType(req.type());
                contact.setContactValue(req.contactValue());
                receivedIds.add(req.id());
                result.add(contact);
            } else {
                ContactData contact = new ContactData();
                contact.setClient(client);
                contact.setType(req.type());
                contact.setContactValue(req.contactValue());
                result.add(contact);
            }
        }

        // USUWANIE
        existing.stream()
                .filter(c -> !receivedIds.contains(c.getId()))
                .forEach(contactDataRepository::delete);

        return contactDataRepository.saveAll(result).stream()
                .map(ContactDataDto::from)
                .toList();
    }
}