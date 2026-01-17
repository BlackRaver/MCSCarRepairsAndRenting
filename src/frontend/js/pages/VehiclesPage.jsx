function VehiclesPage() {
    const [vehicles, setVehicles] = React.useState([]);
    const [clients, setClients] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingVehicle, setEditingVehicle] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    const [formData, setFormData] = React.useState({
        brand: '',
        model: '',
        productionYear: '',
        vin: '',
        vehicleType: 'CLIENT',
        clientId: ''
    });

    // ===== KOLUMNY =====
    const columns = [
        { key: 'brand', label: 'Marka' },
        { key: 'model', label: 'Model' },
        { key: 'productionYear', label: 'Rocznik' },
        { key: 'vin', label: 'VIN' },
        { key: 'vehicleType', label: 'Typ' },
        { key: 'available', label: 'Dostępny' },
        { key: 'client.id', label: 'Właściciel' }
    ];

    React.useEffect(() => {
        loadData();
    }, []);

    
    const loadData = async () => {
        const [vehiclesData, clientsData] = await Promise.all([
            window.apiService.getVehicles(),
            window.apiService.getClients()
        ]);
        setVehicles(vehiclesData);
        setClients(clientsData);
    };

    // ===== RENDER KOMÓREK =====
  const renderCell = (key, value, row) => {
    if (key === 'client') {
        if (!row.client) return '—';

        const c = row.client;
        return c.clientType === 'COMPANY'
            ? c.companyName
            : `${c.firstName} ${c.lastName}`;
    }

    if (key === 'available') {
        if (value === null) return '—';
        return value ? 'TAK' : 'NIE';
    }

    return value;
};

    // ===== FILTROWANIE =====
    const filteredVehicles = vehicles.filter(v => {
        const q = searchQuery.toLowerCase();
        const owner = v.client
            ? `${v.client.firstName} ${v.client.lastName}`.toLowerCase()
            : '';

        return (
            v.brand.toLowerCase().includes(q) ||
            v.model.toLowerCase().includes(q) ||
            v.vin.toLowerCase().includes(q) ||
            String(v.productionYear).includes(q) ||
            v.vehicleType.toLowerCase().includes(q) ||
            owner.includes(q)
        );
    });

    // ===== FORMULARZ =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            brand: formData.brand,
            model: formData.model,
            productionYear: parseInt(formData.productionYear),
            vin: formData.vin,
            vehicleType: formData.vehicleType,
            clientId:
                formData.vehicleType === 'RENTER'
                    ? null
                    : parseInt(formData.clientId)
        };

        if (editingVehicle) {
            await window.apiService.updateVehicle(editingVehicle.id, payload);
        } else {
            await window.apiService.createVehicle(payload);
        }

        await loadData();
        closeModal();
    };

const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);

    setFormData({
        brand: vehicle.brand,
        model: vehicle.model,
        productionYear: vehicle.productionYear,
        vin: vehicle.vin,
        vehicleType: vehicle.vehicleType,
        clientId: vehicle.client ? vehicle.client.id : ''
    });

    setIsModalOpen(true);
};

    const handleDelete = async (id) => {
        if (confirm('Czy na pewno chcesz usunąć ten pojazd?')) {
            await window.apiService.deleteVehicle(id);
            await loadData();
        }
    };

    const openAddModal = () => {
        setEditingVehicle(null);
        setFormData({
            brand: '',
            model: '',
            productionYear: '',
            vin: '',
            vehicleType: 'CLIENT',
            clientId: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🚗 Pojazdy</h1>
                <div className="header-actions">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Szukaj pojazdów..."
                    />
                    <button className="btn btn-primary" onClick={openAddModal}>
                        ➕ Dodaj pojazd
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredVehicles}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderCell={renderCell}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingVehicle ? 'Edytuj pojazd' : 'Nowy pojazd'}
                >
                <form onSubmit={handleSubmit}>
                    {/* PIERWSZA KOLUMNA: Marka i Model */}
                    <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Marka</label>
                        <select
                            name="brand"
                            className="form-select"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Wybierz markę</option>
                            {[
                                "Audi",
                                "BMW",
                                "Mercedes",
                                "Volkswagen",
                                "Toyota",
                                "Honda",
                                "Ford",
                                "Opel",
                                "Renault",
                                "Peugeot",
                                "Fiat",
                                "Skoda",
                                "Hyundai",
                                "Kia",
                                "Nissan",
                            ].map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Model</label>
                        <input
                        name="model"
                        className="form-input"
                        placeholder="Model pojazdu"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    </div>

                    {/* DRUGA KOLUMNA: Rok produkcji i VIN */}
                    <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Rok produkcji</label>
                        <select
                            name="productionYear"
                            className="form-select"
                            value={formData.productionYear}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Wybierz rok</option>
                            {Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">VIN</label>
                        <input
                        name="vin"
                        className="form-input"
                        placeholder="Numer VIN"
                        value={formData.vin}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    </div>

                    {/* TYP POJAZDU */}
                    <div className="form-group">
                    <label className="form-label">Typ</label>
                    <select
                        name="vehicleType"
                        className="form-select"
                        value={formData.vehicleType}
                        onChange={handleChange}
                    >
                        <option value="CLIENT">Klient indywidualny</option>
                        <option value="COMPANY">Firma</option>
                        <option value="RENTER">Auto zastępcze</option>
                    </select>
                    </div>

                    {/* WYBÓR KLIENTA, jeśli nie auto zastępcze */}
                    {formData.vehicleType !== 'RENTER' && (
                    <div className="form-group">
                        <label className="form-label">Klient</label>
                        <select
                        name="clientId"
                        className="form-select"
                        value={formData.clientId}
                        onChange={handleChange}
                        required
                        >
                        <option value="">Wybierz klienta</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>
                            {c.firstName} {c.lastName}
                            </option>
                        ))}
                        </select>
                    </div>
                    )}

                    {/* STOPKA MODALA */}
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        Anuluj
                    </button>
                    <button type="submit" className="btn btn-success">
                        Zapisz
                    </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

window.VehiclesPage = VehiclesPage;
