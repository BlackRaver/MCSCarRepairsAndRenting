function OrdersPage() {
    const [orders, setOrders] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingOrder, setEditingOrder] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('ALL');

    const [formData, setFormData] = React.useState({
        vehicleId: '',
        description: '',
        status: 'NEW',
        notes: ''
    });

    // ===== KOLUMNY =====
    const columns = [
        { key: 'vehicle', label: 'Pojazd' },
        { key: 'status', label: 'Status' },
        { key: 'totalCost', label: 'Koszt' },
        { key: 'createdAt', label: 'Data' }
    ];

    const statusLabels = {
        NEW: 'Nowe',
        IN_PROGRESS: 'W realizacji',
        COMPLETED: 'Zakończone'
    };

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [ordersData, vehiclesData] = await Promise.all([
            window.apiService.getOrders(),
            window.apiService.getVehicles()
        ]);
        setOrders(ordersData);
        setVehicles(vehiclesData);
    };

    // ===== RENDER KOMÓREK =====
    const renderCell = (key, value, row) => {
        if (key === 'vehicle') {
            const v = row.vehicle;
            if (!v) return '—';

            const owner = v.client
                ? v.client.clientType === 'COMPANY'
                    ? v.client.companyName
                    : `${v.client.firstName} ${v.client.lastName}`
                : '';

            return `${v.brand} ${v.model} (${v.productionYear}) ${owner && `- ${owner}`}`;
        }

        if (key === 'status') {
            return (
                <span className={`badge badge-${value.toLowerCase()}`}>
                    {statusLabels[value]}
                </span>
            );
        }

        if (key === 'totalCost') {
            return `${row.totalCost.toFixed(2)} zł`;
        }

        if (key === 'createdAt') {
            return new Date(row.createdAt).toLocaleDateString();
        }

        return value;
    };

    // ===== FILTROWANIE =====
    const filteredOrders = orders.filter(o => {
        if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                o.vehicle?.brand.toLowerCase().includes(q) ||
                o.vehicle?.model.toLowerCase().includes(q)
            );
        }
        return true;
    });

    // ===== FORMULARZ =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            vehicleId: parseInt(formData.vehicleId),
            description: formData.description,
            status: formData.status,
            notes: formData.notes
        };

        if (editingOrder) {
            await window.apiService.updateOrder(editingOrder.id, payload);
        } else {
            await window.apiService.createOrder(payload);
        }

        await loadData();
        closeModal();
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setFormData({
            vehicleId: order.vehicle.id,
            description: order.description,
            status: order.status,
            notes: order.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Czy na pewno usunąć zlecenie?')) {
            await window.apiService.deleteOrder(id);
            await loadData();
        }
    };

    const openAddModal = () => {
        setEditingOrder(null);
        setFormData({
            vehicleId: '',
            description: '',
            status: 'NEW',
            notes: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingOrder(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="page-header">
                <h1>📋 Zlecenia</h1>
                <div className="header-actions">
                    <SearchBox value={searchQuery} onChange={setSearchQuery} />
                    <button className="btn btn-primary" onClick={openAddModal}>
                        ➕ Nowe zlecenie
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredOrders}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderCell={renderCell}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingOrder ? 'Edytuj zlecenie' : 'Nowe zlecenie'}
            >
                <form onSubmit={handleSubmit}>
                    <select
                        name="vehicleId"
                        value={formData.vehicleId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Wybierz pojazd</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.brand} {v.model} ({v.productionYear})
                            </option>
                        ))}
                    </select>

                    <input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Opis zlecenia"
                        required
                    />

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="NEW">Nowe</option>
                        <option value="IN_PROGRESS">W realizacji</option>
                        <option value="COMPLETED">Zakończone</option>
                    </select>

                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Notatki mechanika"
                    />

                    <button type="submit" className="btn btn-success">
                        Zapisz
                    </button>
                </form>
            </Modal>
        </div>
    );
}

window.OrdersPage = OrdersPage;
