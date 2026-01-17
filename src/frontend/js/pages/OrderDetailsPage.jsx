/**
 * OrderDetailsPage – szczegóły zlecenia
 */

function OrderDetailsPage({ orderId }) {
  const { role } = React.useContext(AuthContext);

  const isClient = role === "CLIENT";
  const canEdit = role === "EMPLOYEE" || role === "ADMIN";

  const [order, setOrder] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    loadDetails();
  }, [orderId]);

  const loadDetails = async () => {
    const orderData = await window.apiService.getOrderDetails(orderId);
    setOrder(orderData);
    setItems(orderData.items || []);
  };

  if (!order) return <div>Ładowanie...</div>;

  // ===== KOLUMNY TABELI =====
  const columns = [
    { key: "type", label: "Typ" },
    { key: "name", label: "Opis" },
    { key: "quantity", label: "Ilość" },
    { key: "cost", label: "Koszt" },
  ];

  const renderCell = (key, value, row) => {
    if (key === "type") {
      return row.type === "PART" ? "Część" : "Czynność";
    }
    if (key === "cost") {
      return `${row.cost?.toFixed(2) ?? "0.00"} zł`;
    }
    return value;
  };

  return (
    <div>
      <div className="page-header">
        <h1>🧾 Zlecenie #{order.id}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => window.appNavigate("orders")}
        >
          Powrót
        </button>
      </div>

      {/* ===== INFO O ZLECENIU ===== */}
      <div className="order-summary">
        <p>
          <strong>Pojazd:</strong> {order.vehicleBrand} {order.vehicleModel}
        </p>
        <p>
          <strong>Klient:</strong> {order.clientName}
        </p>
        <p>
          <strong>Mechanik:</strong> {order.mechanicName || "—"}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
      </div>

      {/* ===== TABELA CZĘŚCI / CZYNNOŚCI ===== */}
      <div className="section-header">
        <h2>🔧 Części i czynności</h2>
        {canEdit && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            ➕ Dodaj wpis
          </button>
        )}
      </div>

      <DataTable columns={columns} data={items} renderCell={renderCell} />

      {/* ===== MODAL DODAWANIA ===== */}
      {canEdit && (
        <OrderItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderId={orderId}
          onSaved={loadDetails}
        />
      )}
    </div>
  );
}

window.OrderDetailsPage = OrderDetailsPage;
