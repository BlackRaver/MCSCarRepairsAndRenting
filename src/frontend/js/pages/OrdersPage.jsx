/**
 * OrdersPage – lista i tworzenie zleceń serwisowych (Solution A)
 *
 * Założenia:
 * - Zlecenie tworzone jest minimalnie (vehicle + client)
 * - Status = NEW nadawany przez backend
 * - Brak edycji zlecenia z listy (szczegóły w osobnym ekranie)
 */

function OrdersPage() {
  const { role } = React.useContext(AuthContext);

  const isClient = role === "CLIENT";
  const isEmployee = role === "EMPLOYEE";
  const isAdmin = role === "ADMIN";

  const [orders, setOrders] = React.useState([]);
  const [assignOrder, setAssignOrder] = React.useState(null);
  const [vehicles, setVehicles] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const [formData, setFormData] = React.useState({
    vehicleId: "",
  });

  // ===== KOLUMNY =====
  const columns = [
    { key: "vehicle", label: "Pojazd" },
    { key: "client", label: "Klient" },
    { key: "mechanic", label: "Mechanik" },
    { key: "status", label: "Status" },
    { key: "totalCost", label: "Koszt" },
    { key: "createdAt", label: "Data" },
  ];

  const statusLabels = {
    NEW: "Nowe",
    IN_PROGRESS: "W realizacji",
    COMPLETED: "Zakończone",
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [ordersData, vehiclesData] = await Promise.all([
      window.apiService.getOrders(),
      window.apiService.getVehicles(),
    ]);

    setOrders(Array.isArray(ordersData) ? ordersData : []);
    setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
  };

  // ===== RENDER KOMÓREK =====
  const renderCell = (key, value, row) => {
    if (key === "vehicle") {
      return `${row.vehicleBrand} ${row.vehicleModel}`;
    }

    if (key === "client") {
      return row.clientName || "—";
    }

    if (key === "mechanic") {
      return row.mechanicName || "—";
    }

    if (key === "status") {
      return (
        <span className={`badge badge-${row.status.toLowerCase()}`}>
          {statusLabels[row.status] || row.status}
        </span>
      );
    }

    if (key === "totalCost") {
      return `${row.totalCost?.toFixed(2) ?? "0.00"} zł`;
    }

    if (key === "createdAt") {
      return row.createdAt
        ? new Date(row.createdAt).toLocaleDateString("pl-PL")
        : "—";
    }

    return value;
  };

  // ===== FILTROWANIE =====
  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.vehicle?.brand?.toLowerCase().includes(q) ||
        o.vehicle?.model?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ===== FORMULARZ =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const vehicle = vehicles.find((v) => v.id == formData.vehicleId);

    const payload = {
      vehicleId: Number(formData.vehicleId),
      clientId: vehicle?.client?.id ?? null,
      replacementCar: false,
    };

    await window.apiService.createOrder(payload);

    await loadData();
    closeModal();
  };

  const openAddModal = () => {
    setFormData({ vehicleId: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAssignMechanic = (order) => {
    setAssignOrder(order);
  };

  const handleMechanicAssigned = async () => {
    await loadData();
  };

  const handleEdit = (order) => {
    window.appNavigate("orderDetails", { orderId: order.id });
  };

  const handleDelete = async (id) => {
    if (confirm("Czy na pewno usunąć zlecenie?")) {
      await window.apiService.deleteOrder(id);
      await loadData();
    }
  };

  return (
    <div>
      <div className="header-actions">
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        {!isClient && (
          <button className="btn btn-primary" onClick={openAddModal}>
            ➕ Nowe zlecenie
          </button>
        )}
      </div>
      <div className="filter-tabs">
        <button
          className={`filter-tab ${statusFilter === "ALL" ? "active" : ""}`}
          onClick={() => setStatusFilter("ALL")}
        >
          Wszystkie
        </button>

        <button
          className={`filter-tab ${statusFilter === "NEW" ? "active" : ""}`}
          onClick={() => setStatusFilter("NEW")}
        >
          🆕 Nowe
        </button>

        <button
          className={`filter-tab ${
            statusFilter === "IN_PROGRESS" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("IN_PROGRESS")}
        >
          🔄 W realizacji
        </button>

        <button
          className={`filter-tab ${
            statusFilter === "COMPLETED" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("COMPLETED")}
        >
          ✅ Zakończone
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        renderCell={renderCell}
        onEdit={isAdmin || isEmployee ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        onAssignMechanic={
          isAdmin || isEmployee ? openAssignMechanic : undefined
        }
      />

      {!isClient && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Nowe zlecenie">
          <form onSubmit={handleSubmit}>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
            >
              <option value="">Wybierz pojazd</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.productionYear})
                </option>
              ))}
            </select>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Anuluj
              </button>
              <button type="submit" className="btn btn-success">
                Utwórz zlecenie
              </button>
            </div>
          </form>
        </Modal>
      )}

      <AssignMechanicModal
        order={assignOrder}
        isOpen={!!assignOrder}
        onClose={() => setAssignOrder(null)}
        onAssigned={handleMechanicAssigned}
      />
    </div>
  );
}

window.OrdersPage = OrdersPage;
