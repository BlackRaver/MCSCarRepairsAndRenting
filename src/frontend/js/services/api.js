/**
 * SERWIS API
 * Warstwa abstrakcji do komunikacji z backendem
 *
 * === INSTRUKCJA INTEGRACJI Z BACKENDEM ===
 * 1. Zmień API_BASE na adres Twojego serwera Spring Boot
 * 2. Zmień USE_MOCKS na false
 * 3. Upewnij się, że backend obsługuje CORS
 */

// ============================================
// KONFIGURACJA - ZMIEŃ TE WARTOŚCI
// ============================================

const API_BASE = "http://localhost:8080/api"; // URL backendu Spring Boot
const USE_MOCKS = false; // true = dane testowe, false = prawdziwe API

// ============================================
// SERWIS API
// ============================================

const apiService = {
  // ========== KLIENCI ==========

  /**
   * Pobiera listę wszystkich klientów
   * GET /api/clients
   */
  getClients: async () => {
    if (USE_MOCKS) {
      return Promise.resolve([...window.mockData.clients]);
    }
    const response = await fetch(`${API_BASE}/clients`);
    return response.json();
  },

  /**
   * Tworzy nowego klienta
   * POST /api/clients
   * @param {Object} client - { firstName, lastName, phone, email }
   */
  createClient: async (client) => {
    if (USE_MOCKS) {
      const newClient = { ...client, id: Date.now() };
      window.mockData.clients.push(newClient);
      return Promise.resolve(newClient);
    }
    const response = await fetch(`${API_BASE}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    return response.json();
  },

  /**
   * Aktualizuje istniejącego klienta
   * PUT /api/clients/{id}
   * @param {number} id - ID klienta
   * @param {Object} client - { firstName, lastName, phone, email }
   */
  updateClient: async (id, client) => {
    if (USE_MOCKS) {
      const index = window.mockData.clients.findIndex((c) => c.id === id);
      if (index !== -1) {
        window.mockData.clients[index] = { ...client, id };
      }
      return Promise.resolve(window.mockData.clients[index]);
    }
    const response = await fetch(`${API_BASE}/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    return response.json();
  },

  /**
   * Usuwa klienta
   * DELETE /api/clients/{id}
   * @param {number} id - ID klienta
   */
  deleteClient: async (id) => {
    if (USE_MOCKS) {
      window.mockData.clients = window.mockData.clients.filter(
        (c) => c.id !== id
      );
      return Promise.resolve(true);
    }
    await fetch(`${API_BASE}/clients/${id}`, { method: "DELETE" });
    return true;
  },

  getClientContacts: async (clientId) => {
    const res = await fetch(`${API_BASE}/clients/${clientId}/contacts`);
    return res.json();
  },

  saveClientContacts: async (clientId, contacts) => {
    const res = await fetch(`${API_BASE}/clients/${clientId}/contacts`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contacts),
    });
    return res.json();
  },

  // ========== POJAZDY ==========

  /**
   * Pobiera listę wszystkich pojazdów
   * GET /api/vehicles
   */
  getVehicles: async () => {
    if (USE_MOCKS) {
      return Promise.resolve([...window.mockData.vehicles]);
    }
    const response = await fetch(`${API_BASE}/vehicles`);
    return response.json();
  },

  /**
   * Tworzy nowy pojazd
   * POST /api/vehicles
   * @param {Object} vehicle - { brand, model, year, vin, clientId }
   */
  createVehicle: async (vehicle) => {
    if (USE_MOCKS) {
      const newVehicle = { ...vehicle, id: Date.now() };
      window.mockData.vehicles.push(newVehicle);
      return Promise.resolve(newVehicle);
    }
    const response = await fetch(`${API_BASE}/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });
    return response.json();
  },

  /**
   * Aktualizuje istniejący pojazd
   * PUT /api/vehicles/{id}
   * @param {number} id - ID pojazdu
   * @param {Object} vehicle - { brand, model, year, vin, clientId }
   */
  updateVehicle: async (id, vehicle) => {
    if (USE_MOCKS) {
      const index = window.mockData.vehicles.findIndex((v) => v.id === id);
      if (index !== -1) {
        window.mockData.vehicles[index] = { ...vehicle, id };
      }
      return Promise.resolve(window.mockData.vehicles[index]);
    }
    const response = await fetch(`${API_BASE}/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });
    return response.json();
  },

  /**
   * Usuwa pojazd
   * DELETE /api/vehicles/{id}
   * @param {number} id - ID pojazdu
   */
  deleteVehicle: async (id) => {
    if (USE_MOCKS) {
      window.mockData.vehicles = window.mockData.vehicles.filter(
        (v) => v.id !== id
      );
      return Promise.resolve(true);
    }
    await fetch(`${API_BASE}/vehicles/${id}`, { method: "DELETE" });
    return true;
  },

  // ========== ZLECENIA ==========

  /**
   * Pobiera listę wszystkich zleceń
   * GET /api/orders
   */
  getOrders: async () => {
    if (USE_MOCKS) {
      return Promise.resolve([...window.mockData.orders]);
    }
    const response = await fetch(`${API_BASE}/orders`);
    return response.json();
  },

  /**
   * Tworzy nowe zlecenie
   * POST /api/orders
   * @param {Object} order - { vehicleId, description, status, laborCost, parts, notes }
   */
  createOrder: async (order) => {
    if (USE_MOCKS) {
      const newOrder = {
        ...order,
        id: Date.now(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      window.mockData.orders.push(newOrder);
      return Promise.resolve(newOrder);
    }
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return response.json();
  },

  /**
   * Aktualizuje istniejące zlecenie
   * PUT /api/orders/{id}
   * @param {number} id - ID zlecenia
   * @param {Object} order - { vehicleId, description, status, laborCost, parts, notes, createdAt }
   */
  updateOrder: async (id, order) => {
    if (USE_MOCKS) {
      const index = window.mockData.orders.findIndex((o) => o.id === id);
      if (index !== -1) {
        window.mockData.orders[index] = { ...order, id };
      }
      return Promise.resolve(window.mockData.orders[index]);
    }
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return response.json();
  },

  /**
   * Usuwa zlecenie
   * DELETE /api/orders/{id}
   * @param {number} id - ID zlecenia
   */
  deleteOrder: async (id) => {
    if (USE_MOCKS) {
      window.mockData.orders = window.mockData.orders.filter(
        (o) => o.id !== id
      );
      return Promise.resolve(true);
    }
    await fetch(`${API_BASE}/orders/${id}`, { method: "DELETE" });
    return true;
  },

  // ========== PRACOWNICY ==========

  /**
   * Pobiera listę pracowników
   * GET /api/employees
   */
  getEmployees: async () => {
    if (USE_MOCKS) {
      return Promise.resolve([...window.mockData.employees]);
    }

    const res = await fetch(`${API_BASE}/employees`);
    return res.json();
  },

  /**
   * Pobiera pojedynczego pracownika
   * GET /api/employees/{id}
   */
  getEmployeeById: async (id) => {
    if (USE_MOCKS) {
      return Promise.resolve(
        window.mockData.employees.find((e) => e.id === id)
      );
    }

    const res = await fetch(`${API_BASE}/employees/${id}`);
    return res.json();
  },

  /**
   * Tworzy nowego pracownika
   * POST /api/employees
   * @param {Object} employee - { firstName, lastName, role }
   */
  createEmployee: async (employee) => {
    if (USE_MOCKS) {
      const newEmployee = { ...employee, id: Date.now() };
      window.mockData.employees.push(newEmployee);
      return Promise.resolve(newEmployee);
    }

    const res = await fetch(`${API_BASE}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    return res.json();
  },

  /**
   * Aktualizuje pracownika
   * PUT /api/employees/{id}
   * @param {number} id
   * @param {Object} employee - { firstName, lastName, role }
   */
  updateEmployee: async (id, employee) => {
    if (USE_MOCKS) {
      const idx = window.mockData.employees.findIndex((e) => e.id === id);
      if (idx !== -1) {
        window.mockData.employees[idx] = { ...employee, id };
      }
      return Promise.resolve(window.mockData.employees[idx]);
    }

    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    return res.json();
  },

  /**
   * Usuwa pracownika
   * DELETE /api/employees/{id}
   */
  deleteEmployee: async (id) => {
    if (USE_MOCKS) {
      window.mockData.employees = window.mockData.employees.filter(
        (e) => e.id !== id
      );
      return Promise.resolve(true);
    }

    await fetch(`${API_BASE}/employees/${id}`, {
      method: "DELETE",
    });

    return true;
  },

  /**
   * Pobiera listę mechaników i ich zleceń
   */
  getMechanicWorkload: async () => {
    const res = await fetch(`${API_BASE}/employee/workload`);
    return res.json();
  },

  /**
   * Przypisuje mechanika do zlecenia
   */
  assignMechanic: async (orderId, mechanicId) => {
    await fetch(`${API_BASE}/orders/${orderId}/mechanic/${mechanicId}`, {
      method: "POST",
    });
  },
};
// Udostępnij globalnie
window.apiService = apiService;
