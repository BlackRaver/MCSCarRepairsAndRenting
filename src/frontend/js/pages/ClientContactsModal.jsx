function ClientContactsModal({ client, isOpen, onClose }) {

    const [contacts, setContacts] = React.useState([]);
    const [type, setType] = React.useState('PHONE');
    const [value, setValue] = React.useState('');

    React.useEffect(() => {
        if (client) {
            loadContacts();
        }
    }, [client]);

    const loadContacts = async () => {
        const data = await window.apiService.getClientContacts(client.id);
        setContacts(data);
    };

    const handleAdd = () => {
        if (!value.trim()) return;

   setContacts(prev => [
    ...prev,
    {
        id: null,
        type,
        contactValue: value
    }
]);
        setValue('');
    };

    const handleDelete = (index) => {
        setContacts(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        await window.apiService.saveClientContacts(client.id, contacts);
        onClose();
    };

    if (!isOpen || !client) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dane kontaktowe">
            <h3>
                {client.clientType === 'COMPANY'
                ? client.companyName
                : `${client.firstName} ${client.lastName}`}
            </h3>

            {/* ===== TABELA KONTAKTÓW ===== */}
            <table className="data-table">
                <thead>
                <tr>
                    <th>Typ</th>
                    <th>Wartość</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {contacts.map((c, index) => (
                    <tr key={index}>
                    <td>{c.type}</td>
                    <td>{c.contactValue}</td>
                    <td>
                        <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(index)}
                        >
                        🗑️
                        </button>
                    </td>
                    </tr>
                ))}
                {contacts.length === 0 && (
                    <tr>
                    <td colSpan="3">Brak danych kontaktowych</td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* ===== DODAWANIE KONTAKTU ===== */}
            <div className="form-row">
                <div className="form-group">
                <label className="form-label">Typ kontaktu</label>
                <select
                    name="contactType"
                    className="form-select"
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value="PHONE">Telefon</option>
                    <option value="EMAIL">E-mail</option>
                    <option value="ADDRESS">Adres</option>
                </select>
                </div>

                <div className="form-group">
                <label className="form-label">Wartość</label>
                <input
                    type="text"
                    name="contactValue"
                    className="form-input"
                    placeholder="Wartość"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                </div>

                <div className="form-group" style={{ alignSelf: 'end' }}>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAdd}
                >
                    ➕ Dodaj
                </button>
                </div>
            </div>

            {/* ===== FOOTER MODALA ===== */}
            <div className="modal-footer">
                <button type="button" onClick={onClose} className="btn btn-secondary">
                Anuluj
                </button>
                <button type="button" onClick={handleSave} className="btn btn-success">
                💾 Zapisz zmiany
                </button>
            </div>
        </Modal>

    );
}

window.ClientContactsModal = ClientContactsModal;
