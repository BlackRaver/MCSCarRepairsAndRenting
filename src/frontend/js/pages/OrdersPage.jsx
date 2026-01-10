/**
 * OrdersPage – lista i tworzenie zleceń serwisowych (Solution A)
 * 
 * Założenia:
 * - Zlecenie tworzone jest minimalnie (vehicle + client)
 * - Status = NEW nadawany przez backend
 * - Brak edycji zlecenia z listy (szczegóły w osobnym ekranie)
 */

function OrdersPage() {
    const [orders, setOrders] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('ALL');

    const [formData, setFormData] = React.useState({
        vehicleId: ''
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

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
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

            return `${v.brand} ${v.model} (${v.productionYear})${owner ? ` - ${owner}` : ''}`;
        }

        if (key === 'status') {
            return (
                <span className={`badge badge-${value.toLowerCase()}`}>
                    {statusLabels[value] || value}
                </span>
            );
        }

        if (key === 'totalCost') {
            return `${row.totalCost?.toFixed(2) ?? '0.00'} zł`;
        }

        if (key === 'createdAt') {
            return new Date(row.createdAt).toLocaleDateString();
        }

        return value;
    };

    // ===== FILTROWANIE =====
    const safeOrders = Array.isArray(orders) ? orders : [];

    const filteredOrders = safeOrders.filter(o => {
        if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;

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

        const vehicle = vehicles.find(v => v.id == formData.vehicleId);

        const payload = {
            vehicleId: Number(formData.vehicleId),
            clientId: vehicle?.client?.id ?? null,
            replacementCar: false
        };

        await window.apiService.createOrder(payload);

        await loadData();
        closeModal();
    };

    const openAddModal = () => {
        setFormData({ vehicleId: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        alert('Edycja dostępna w szczegółach zlecenia');
    };

    const handleDelete = async (id) => {
        if (confirm('Czy na pewno usunąć zlecenie?')) {
            await window.apiService.deleteOrder(id);
            await loadData();
        }
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
                title="Nowe zlecenie"
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

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                            Anuluj
                        </button>
                        <button type="submit" className="btn btn-success">
                            Utwórz zlecenie
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

window.OrdersPage = OrdersPage;
