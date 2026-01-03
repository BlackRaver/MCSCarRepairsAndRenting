/**
 * OrdersPage - Strona zarządzania zleceniami serwisowymi
 * 
 * Funkcje:
 * - Wyświetlanie listy zleceń w tabeli
 * - Wyszukiwanie zleceń
 * - Filtrowanie po statusie (zakładki)
 * - Dodawanie nowych zleceń z kosztorysem i częściami
 * - Edycja istniejących zleceń
 * - Usuwanie zleceń
 * - Automatyczne obliczanie sumy kosztów
 */
function OrdersPage() {
    // Stan komponentu
    const [orders, setOrders] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [clients, setClients] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingOrder, setEditingOrder] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');

    const [formData, setFormData] = React.useState({
        vehicleId: '',
        description: '',
        status: 'new',
        laborCost: '',
        parts: [],
        notes: ''
    });

    // Definicja kolumn tabeli
    const columns = [
        { key: 'vehicleId', label: 'Pojazd' },
        { key: 'description', label: 'Opis' },
        { key: 'status', label: 'Status' },
        { key: 'totalCost', label: 'Koszt' },
        { key: 'createdAt', label: 'Data' }
    ];

    // Mapowanie statusów
    const statusLabels = {
        'new': 'Nowe',
        'in_progress': 'W realizacji',
        'completed': 'Zakończone'
    };

    // Pobranie danych przy montowaniu
    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [ordersData, vehiclesData, clientsData] = await Promise.all([
            window.apiService.getOrders(),
            window.apiService.getVehicles(),
            window.apiService.getClients()
        ]);
        setOrders(ordersData);
        setVehicles(vehiclesData);
        setClients(clientsData);
    };

    // Helper - pobierz info o pojeździe
    const getVehicleInfo = (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return 'Nieznany';
        const client = clients.find(c => c.id === vehicle.clientId);
        return `${vehicle.brand} ${vehicle.model} ${client ? `(${client.firstName} ${client.lastName})` : ''}`;
    };

    // Oblicz sumę kosztów zlecenia
    const calculateTotal = (order) => {
        const laborCost = order.laborCost || 0;
        const partsCost = (order.parts || []).reduce((sum, p) => sum + (p.price || 0), 0);
        return laborCost + partsCost;
    };

    // Customowe renderowanie komórek
    const renderCell = (key, value, row) => {
        if (key === 'vehicleId') {
            return getVehicleInfo(value);
        }
        if (key === 'status') {
            const badgeClass = {
                'new': 'badge-new',
                'in_progress': 'badge-in-progress',
                'completed': 'badge-completed'
            }[value] || '';
            return <span className={`badge ${badgeClass}`}>{statusLabels[value] || value}</span>;
        }
        if (key === 'totalCost') {
            return <span className="cost-value">{calculateTotal(row).toFixed(2)} zł</span>;
        }
        return value;
    };

    // Filtrowanie zleceń po wyszukiwaniu i statusie
    const filteredOrders = orders.filter(o => {
        // Filtr statusu
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;

        // Filtr wyszukiwania
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const vehicleInfo = getVehicleInfo(o.vehicleId).toLowerCase();
            return o.description.toLowerCase().includes(query) || vehicleInfo.includes(query);
        }
        return true;
    });

    // Obsługa formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            vehicleId: parseInt(formData.vehicleId),
            laborCost: parseFloat(formData.laborCost) || 0,
            parts: formData.parts.filter(p => p.name.trim() !== '')
        };

        if (editingOrder) {
            await window.apiService.updateOrder(editingOrder.id, {
                ...data,
                createdAt: editingOrder.createdAt
            });
        } else {
            await window.apiService.createOrder(data);
        }
        await loadData();
        closeModal();
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setFormData({
            vehicleId: order.vehicleId.toString(),
            description: order.description,
            status: order.status,
            laborCost: (order.laborCost || 0).toString(),
            parts: order.parts || [],
            notes: order.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Czy na pewno chcesz usunąć to zlecenie?')) {
            await window.apiService.deleteOrder(id);
            await loadData();
        }
    };

    const openAddModal = () => {
        setEditingOrder(null);
        setFormData({
            vehicleId: '',
            description: '',
            status: 'new',
            laborCost: '',
            parts: [],
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

    // ========== ZARZĄDZANIE CZĘŚCIAMI ==========

    const addPart = () => {
        setFormData({
            ...formData,
            parts: [...formData.parts, { name: '', price: 0 }]
        });
    };

    const updatePart = (index, field, value) => {
        const newParts = [...formData.parts];
        newParts[index] = {
            ...newParts[index],
            [field]: field === 'price' ? parseFloat(value) || 0 : value
        };
        setFormData({ ...formData, parts: newParts });
    };

    const removePart = (index) => {
        setFormData({
            ...formData,
            parts: formData.parts.filter((_, i) => i !== index)
        });
    };

    // ========== OBLICZENIA KOSZTÓW ==========

    const laborCost = parseFloat(formData.laborCost) || 0;
    const partsCost = formData.parts.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalCost = laborCost + partsCost;

    return (
        <div>
            {/* Nagłówek strony */}
            <div className="page-header">
                <h1 className="page-title">📋 Zlecenia serwisowe</h1>
                <div className="header-actions">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Szukaj zleceń..."
                    />
                    <button className="btn btn-primary" onClick={openAddModal}>
                        ➕ Nowe zlecenie
                    </button>
                </div>
            </div>

            {/* Zakładki filtrów statusu */}
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                >
                    Wszystkie ({orders.length})
                </button>
                <button
                    className={`filter-tab ${statusFilter === 'new' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('new')}
                >
                    🆕 Nowe ({orders.filter(o => o.status === 'new').length})
                </button>
                <button
                    className={`filter-tab ${statusFilter === 'in_progress' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('in_progress')}
                >
                    🔄 W realizacji ({orders.filter(o => o.status === 'in_progress').length})
                </button>
                <button
                    className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('completed')}
                >
                    ✅ Zakończone ({orders.filter(o => o.status === 'completed').length})
                </button>
            </div>

            {/* Licznik wyników */}
            {searchQuery && (
                <p className="results-count">Znaleziono: {filteredOrders.length}</p>
            )}

            {/* Tabela zleceń */}
            <DataTable
                columns={columns}
                data={filteredOrders}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderCell={renderCell}
            />

            {/* Modal formularza */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingOrder ? 'Edytuj zlecenie' : 'Nowe zlecenie'}
                large
            >
                <form onSubmit={handleSubmit}>
                    {/* === PODSTAWOWE INFORMACJE === */}
                    <div className="form-group">
                        <label className="form-label">Pojazd</label>
                        <select
                            name="vehicleId"
                            className="form-select"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Wybierz pojazd...</option>
                            {vehicles.map(v => {
                                const c = clients.find(c => c.id === v.clientId);
                                return (
                                    <option key={v.id} value={v.id}>
                                        {v.brand} {v.model} ({v.year})
                                        {c ? ` - ${c.firstName} ${c.lastName}` : ''}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Opis zlecenia</label>
                        <input
                            type="text"
                            name="description"
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="np. Wymiana oleju i filtrów"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            className="form-select"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="new">Nowe</option>
                            <option value="in_progress">W realizacji</option>
                            <option value="completed">Zakończone</option>
                        </select>
                    </div>

                    {/* === SEKCJA: KOSZTY === */}
                    <div className="form-section">
                        <h3 className="form-section-title">💰 Koszty</h3>
                        <div className="form-group">
                            <label className="form-label">Koszt robocizny (zł)</label>
                            <input
                                type="number"
                                name="laborCost"
                                className="form-input"
                                value={formData.laborCost}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* === SEKCJA: CZĘŚCI === */}
                    <div className="form-section">
                        <h3 className="form-section-title">🔧 Części zamienne</h3>
                        <div className="parts-list">
                            {formData.parts.map((part, index) => (
                                <div key={index} className="part-item">
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={part.name}
                                        onChange={(e) => updatePart(index, 'name', e.target.value)}
                                        placeholder="Nazwa części"
                                    />
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={part.price}
                                        onChange={(e) => updatePart(index, 'price', e.target.value)}
                                        placeholder="Cena"
                                        min="0"
                                        step="0.01"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-icon"
                                        onClick={() => removePart(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={addPart}
                        >
                            ➕ Dodaj część
                        </button>
                    </div>

                    {/* === PODSUMOWANIE KOSZTÓW === */}
                    <div className="cost-summary">
                        <div className="cost-row">
                            <span>Robocizna:</span>
                            <span className="cost-value">{laborCost.toFixed(2)} zł</span>
                        </div>
                        <div className="cost-row">
                            <span>Części ({formData.parts.length}):</span>
                            <span className="cost-value">{partsCost.toFixed(2)} zł</span>
                        </div>
                        <div className="cost-row total">
                            <span>SUMA:</span>
                            <span className="cost-value">{totalCost.toFixed(2)} zł</span>
                        </div>
                    </div>

                    {/* === SEKCJA: NOTATKI === */}
                    <div className="form-section">
                        <h3 className="form-section-title">📝 Notatki mechanika</h3>
                        <div className="form-group">
                            <textarea
                                name="notes"
                                className="form-textarea"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Uwagi, obserwacje, zalecenia dla klienta..."
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                            Anuluj
                        </button>
                        <button type="submit" className="btn btn-success">
                            {editingOrder ? 'Zapisz zmiany' : 'Utwórz zlecenie'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

// Udostępnij globalnie
window.OrdersPage = OrdersPage;
