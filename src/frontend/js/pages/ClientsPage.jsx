/**
 * ClientsPage – zarządzanie klientami
 * Backend: Spring Boot /api/clients
 */

function ClientsPage() {

    const [clients, setClients] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingClient, setEditingClient] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [contactClient, setContactClient] = React.useState(null);

    const [formData, setFormData] = React.useState({
        clientType: 'PERSON',
        firstName: '',
        lastName: '',
        companyName: '',
        nip: ''
    });

    // =========================
    // KOLUMNY TABELI
    // =========================
    const columns = [
        { key: 'type', label: 'Typ' },
        { key: 'name', label: 'Nazwa / Imię i nazwisko' },
        { key: 'nip', label: 'NIP' }
    ];

    React.useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        const data = await window.apiService.getClients();
        setClients(data);
    };

    const handleContact = (client) => {
    setContactClient(client);
};

    // =========================
    // RENDER KOMÓREK
    // =========================
    const renderCell = (key, value, row) => {

        if (key === 'type') {
            return row.clientType === 'COMPANY' ? 'Firma' : 'Osoba fizyczna';
        }

        if (key === 'name') {
            return row.clientType === 'COMPANY'
                ? row.companyName
                : `${row.firstName} ${row.lastName}`;
        }

        if (key === 'nip') {
            return row.clientType === 'COMPANY' ? row.nip : '—';
        }

        return value;
    };

    // =========================
    // FILTROWANIE
    // =========================
    const filteredClients = clients.filter(c => {
        const q = searchQuery.toLowerCase();

        const name =
            c.clientType === 'COMPANY'
                ? (c.companyName || '')
                : `${c.firstName} ${c.lastName}`;

        return (
            name.toLowerCase().includes(q) ||
            (c.nip || '').includes(q)
        );
    });

    // =========================
    // FORMULARZ
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            clientType: formData.clientType
        };

        if (formData.clientType === 'PERSON') {
            payload.firstName = formData.firstName;
            payload.lastName = formData.lastName;
        } else {
            payload.companyName = formData.companyName;
            payload.nip = formData.nip;
        }

        if (editingClient) {
            await window.apiService.updateClient(editingClient.id, payload);
        } else {
            await window.apiService.createClient(payload);
        }

        await loadClients();
        closeModal();
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            clientType: client.clientType,
            firstName: client.firstName || '',
            lastName: client.lastName || '',
            companyName: client.companyName || '',
            nip: client.nip || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
            await window.apiService.deleteClient(id);
            await loadClients();
        }
    };

    const openAddModal = () => {
        setEditingClient(null);
        setFormData({
            clientType: 'PERSON',
            firstName: '',
            lastName: '',
            companyName: '',
            nip: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // RENDER
    // =========================
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">👤 Klienci</h1>
                <div className="header-actions">
                    <SearchBox
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Szukaj klientów..."
                    />
                    <button className="btn btn-primary" onClick={openAddModal}>
                        ➕ Dodaj klienta
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredClients}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onContact={handleContact}
                renderCell={renderCell}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingClient ? 'Edytuj klienta' : 'Nowy klient'}
                >
                <form onSubmit={handleSubmit}>
                    {/* TYP KLIENTA */}
                    <div className="form-group">
                    <label className="form-label">Typ klienta</label>
                    <select
                        name="clientType"
                        className="form-select"
                        value={formData.clientType}
                        onChange={handleChange}
                    >
                        <option value="PERSON">Osoba fizyczna</option>
                        <option value="COMPANY">Firma</option>
                    </select>
                    </div>

                    {/* OSOBA FIZYCZNA */}
                    {formData.clientType === 'PERSON' && (
                    <>
                        <div className="form-group">
                        <label className="form-label">Imię</label>
                        <input
                            name="firstName"
                            className="form-input"
                            placeholder="Imię"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        </div>
                        <div className="form-group">
                        <label className="form-label">Nazwisko</label>
                        <input
                            name="lastName"
                            className="form-input"
                            placeholder="Nazwisko"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        </div>
                    </>
                    )}

                    {/* FIRMA */}
                    {formData.clientType === 'COMPANY' && (
                    <>
                        <div className="form-group">
                        <label className="form-label">Nazwa firmy</label>
                        <input
                            name="companyName"
                            className="form-input"
                            placeholder="Nazwa firmy"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                        </div>
                        <div className="form-group">
                        <label className="form-label">NIP</label>
                        <input
                            name="nip"
                            className="form-input"
                            placeholder="NIP"
                            value={formData.nip}
                            onChange={handleChange}
                            required
                        />
                        </div>
                    </>
                    )}

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

            <ClientContactsModal
    client={contactClient}
    isOpen={!!contactClient}
    onClose={() => setContactClient(null)}
/>
        </div>
        
    );
}

// Global export
window.ClientsPage = ClientsPage;
