/**
 * DANE MOCKOWE
 * Przykładowe dane testowe do demonstracji aplikacji
 * 
 * Po podłączeniu backendu te dane nie będą używane
 * (USE_MOCKS = false w api.js)
 */

const mockData = {
    // Lista klientów
    clients: [
        { id: 1, firstName: 'Jan', lastName: 'Kowalski', phone: '500-100-200', email: 'jan.kowalski@email.pl' },
        { id: 2, firstName: 'Anna', lastName: 'Nowak', phone: '501-200-300', email: 'anna.nowak@email.pl' },
        { id: 3, firstName: 'Piotr', lastName: 'Wiśniewski', phone: '502-300-400', email: 'piotr.wisniewski@email.pl' },
        { id: 4, firstName: 'Maria', lastName: 'Wójcik', phone: '503-400-500', email: 'maria.wojcik@email.pl' },
        { id: 5, firstName: 'Tomasz', lastName: 'Kamiński', phone: '504-500-600', email: 'tomasz.kaminski@email.pl' },
    ],

    // Lista pojazdów
    vehicles: [
        // { id: 1, brand: 'Volkswagen', model: 'Golf VII', year: 2018, vin: 'WVWZZZ1KZAW123456', clientId: 1 },
        // { id: 2, brand: 'Toyota', model: 'Corolla', year: 2020, vin: 'JTDKN3DU5L0123456', clientId: 2 },
        // { id: 3, brand: 'Ford', model: 'Focus', year: 2017, vin: 'WF0XXXGCDXH123456', clientId: 1 },
        // { id: 4, brand: 'Skoda', model: 'Octavia', year: 2019, vin: 'TMBAK7NE5J0123456', clientId: 3 },
        // { id: 5, brand: 'BMW', model: '320d', year: 2021, vin: 'WBA8E1G50JN123456', clientId: 4 },
        // { id: 6, brand: 'Audi', model: 'A4', year: 2016, vin: 'WAUZZZ8K5GA123456', clientId: 5 },
    ],

    // Lista zleceń serwisowych
    orders: [
        {
            id: 1,
            vehicleId: 1,
            description: 'Wymiana oleju i filtrów',
            status: 'completed',
            createdAt: '2024-12-15',
            laborCost: 150,
            parts: [
                { name: 'Olej 5W30', price: 120 },
                { name: 'Filtr oleju', price: 45 }
            ],
            notes: 'Klient prosił o olej syntetyczny'
        },
        {
            id: 2,
            vehicleId: 2,
            description: 'Przegląd okresowy',
            status: 'in_progress',
            createdAt: '2024-12-18',
            laborCost: 200,
            parts: [
                { name: 'Filtr powietrza', price: 65 }
            ],
            notes: ''
        },
        {
            id: 3,
            vehicleId: 3,
            description: 'Wymiana klocków hamulcowych',
            status: 'new',
            createdAt: '2024-12-19',
            laborCost: 180,
            parts: [
                { name: 'Klocki przód', price: 220 },
                { name: 'Klocki tył', price: 180 }
            ],
            notes: 'Tarcze w dobrym stanie'
        },
        {
            id: 4,
            vehicleId: 4,
            description: 'Naprawa klimatyzacji',
            status: 'in_progress',
            createdAt: '2024-12-17',
            laborCost: 350,
            parts: [
                { name: 'Czynnik R134a', price: 150 }
            ],
            notes: 'Nieszczelność przy sprężarce'
        },
        {
            id: 5,
            vehicleId: 5,
            description: 'Wymiana rozrządu',
            status: 'new',
            createdAt: '2024-12-19',
            laborCost: 800,
            parts: [
                { name: 'Zestaw rozrządu', price: 650 },
                { name: 'Pompa wody', price: 320 }
            ],
            notes: ''
        },
    ]
};

// Udostępnij globalnie
window.mockData = mockData;
