# Dokumentacja Systemu Warsztatu Samochodowego

## Spis treści
1. [Struktura projektu](#struktura-projektu)
2. [Endpointy API](#endpointy-api)
3. [Modele danych](#modele-danych)
4. [Integracja z backendem](#integracja-z-backendem)
5. [Architektura frontendu](#architektura-frontendu)

---

## Struktura projektu

```
warsztat-frontend/
├── index.html                    # Główny plik HTML
├── DOKUMENTACJA.md               # Ten plik
├── css/
│   └── styles.css                # Style aplikacji
└── js/
    ├── mocks/
    │   └── data.js               # Dane testowe (mocki)
    ├── services/
    │   └── api.js                # Serwis API (do integracji z backendem)
    ├── components/
    │   ├── Navbar.jsx            # Nawigacja
    │   ├── SearchBox.jsx         # Pole wyszukiwania
    │   ├── Modal.jsx             # Okno modalne
    │   └── DataTable.jsx         # Tabela danych
    ├── pages/
    │   ├── ClientsPage.jsx       # Strona klientów
    │   ├── VehiclesPage.jsx      # Strona pojazdów
    │   └── OrdersPage.jsx        # Strona zleceń
    └── App.jsx                   # Główny komponent aplikacji
```
---

## Endpointy API

### Konfiguracja

```javascript
const API_BASE = 'http://localhost:8080/api';  // URL backendu
const USE_MOCKS = true;                         // true = mocki, false = prawdziwe API
```

---

### 👥 Klienci (`/api/clients`)

| Metoda | Endpoint | Opis | Request Body | Response |
|--------|----------|------|--------------|----------|
| `GET` | `/api/clients` | Pobierz listę klientów | - | `Client[]` |
| `POST` | `/api/clients` | Dodaj nowego klienta | `Client` (bez id) | `Client` (z id) |
| `PUT` | `/api/clients/{id}` | Edytuj klienta | `Client` | `Client` |
| `DELETE` | `/api/clients/{id}` | Usuń klienta | - | - |

**Przykład odpowiedzi GET:**
```json
[
  {
    "id": 1,
    "firstName": "Jan",
    "lastName": "Kowalski",
    "phone": "500-100-200",
    "email": "jan.kowalski@email.pl"
  }
]
```

---

### 🚗 Pojazdy (`/api/vehicles`)

| Metoda | Endpoint | Opis | Request Body | Response |
|--------|----------|------|--------------|----------|
| `GET` | `/api/vehicles` | Pobierz listę pojazdów | - | `Vehicle[]` |
| `POST` | `/api/vehicles` | Dodaj nowy pojazd | `Vehicle` (bez id) | `Vehicle` (z id) |
| `PUT` | `/api/vehicles/{id}` | Edytuj pojazd | `Vehicle` | `Vehicle` |
| `DELETE` | `/api/vehicles/{id}` | Usuń pojazd | - | - |

**Przykład odpowiedzi GET:**
```json
[
  {
    "id": 1,
    "brand": "Volkswagen",
    "model": "Golf VII",
    "year": 2018,
    "vin": "WVWZZZ1KZAW123456",
    "clientId": 1
  }
]
```

---

### 📋 Zlecenia (`/api/orders`)

| Metoda | Endpoint | Opis | Request Body | Response |
|--------|----------|------|--------------|----------|
| `GET` | `/api/orders` | Pobierz listę zleceń | - | `Order[]` |
| `POST` | `/api/orders` | Utwórz nowe zlecenie | `Order` (bez id) | `Order` (z id) |
| `PUT` | `/api/orders/{id}` | Edytuj zlecenie | `Order` | `Order` |
| `DELETE` | `/api/orders/{id}` | Usuń zlecenie | - | - |

**Przykład odpowiedzi GET:**
```json
[
  {
    "id": 1,
    "vehicleId": 1,
    "description": "Wymiana oleju i filtrów",
    "status": "completed",
    "createdAt": "2024-12-15",
    "laborCost": 150.00,
    "parts": [
      { "name": "Olej 5W30", "price": 120.00 },
      { "name": "Filtr oleju", "price": 45.00 }
    ],
    "notes": "Klient prosił o olej syntetyczny"
  }
]
```

---

## Modele danych

### Client (Klient)

```java
@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;   // Imię
    private String lastName;    // Nazwisko
    private String phone;       // Telefon (np. "500-100-200")
    private String email;       // Email
}
```

### Vehicle (Pojazd)

```java
@Entity
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String brand;       // Marka (np. "Volkswagen")
    private String model;       // Model (np. "Golf VII")
    private Integer year;       // Rocznik (np. 2018)
    private String vin;         // Numer VIN
    
    @ManyToOne
    private Client client;      // Właściciel (relacja)
    // LUB
    private Long clientId;      // ID klienta (prostsza wersja)
}
```

### Order (Zlecenie serwisowe)

```java
@Entity
public class ServiceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Vehicle vehicle;    // Pojazd (relacja)
    // LUB
    private Long vehicleId;     // ID pojazdu
    
    private String description; // Opis zlecenia
    private String status;      // "new" | "in_progress" | "completed"
    private String createdAt;   // Data utworzenia "YYYY-MM-DD"
    private Double laborCost;   // Koszt robocizny
    
    @OneToMany
    private List<Part> parts;   // Lista części
    
    private String notes;       // Notatki mechanika
}
```

### Part (Część zamienna)

```java
@Embeddable  // lub @Entity
public class Part {
    private String name;        // Nazwa części
    private Double price;       // Cena
}
```

---

## Integracja z backendem

### Krok 1: Zmień konfigurację

W pliku `index.html` (około linii 380):

```javascript
const API_BASE = 'http://localhost:8080/api';  // Twój URL
const USE_MOCKS = false;                        // Wyłącz mocki
```

### Krok 2: Skonfiguruj CORS w Spring Boot

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")  // lub konkretny adres
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

### Krok 3: Utwórz kontrolery

```java
@RestController
@RequestMapping("/api/clients")
public class ClientController {
    
    @GetMapping
    public List<Client> getAll() { ... }
    
    @PostMapping
    public Client create(@RequestBody Client client) { ... }
    
    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client client) { ... }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { ... }
}
```

---

## Architektura frontendu

### Przepływ danych

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Strony    │ ──▶ │  apiService  │ ──▶ │   Backend   │
│  (Pages)    │ ◀── │   (fetch)    │ ◀── │  Spring Boot│
└─────────────┘     └──────────────┘     └─────────────┘
       │                                        │
       ▼                                        ▼
┌─────────────┐                          ┌─────────────┐
│ Komponenty  │                          │    Baza     │
│  (UI)       │                          │   danych    │
└─────────────┘                          └─────────────┘
```

### Główne komponenty

| Komponent | Opis |
|-----------|------|
| `Navbar` | Nawigacja między stronami |
| `SearchBox` | Pole wyszukiwania |
| `Modal` | Okno modalne dla formularzy |
| `DataTable` | Uniwersalna tabela z akcjami |

### Strony

| Strona | Funkcje |
|--------|---------|
| `ClientsPage` | CRUD klientów + wyszukiwanie |
| `VehiclesPage` | CRUD pojazdów + wyszukiwanie |
| `OrdersPage` | CRUD zleceń + filtry statusu + koszty + części |

---

## Statusy zleceń

| Wartość | Wyświetlana nazwa | Kolor |
|---------|-------------------|-------|
| `new` | Nowe | Niebieski |
| `in_progress` | W realizacji | Pomarańczowy |
| `completed` | Zakończone | Zielony |

---

## Testowanie

### Z mockami (domyślnie)
Otwórz `index.html` w przeglądarce - dane testowe są wbudowane.

### Z backendem
1. Uruchom backend Spring Boot
2. Zmień `USE_MOCKS = false`
3. Odśwież stronę

---