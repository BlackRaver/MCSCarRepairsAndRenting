function AssignMechanicModal({ order, isOpen, onClose, onAssigned }) {
  const [mechanics, setMechanics] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      loadMechanics();
    }
  }, [isOpen]);

  const loadMechanics = async () => {
    const data = await window.apiService.getMechanicWorkload();
    setMechanics(data);
  };

  const handleAssign = async () => {
    await window.apiService.assignMechanic(order.id, selectedId);
    onAssigned();
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Przypisz mechanika">
      <table className="data-table">
        <thead>
          <tr>
            <th>Mechanik</th>
            <th>Aktywne zlecenia</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {mechanics.map((m) => (
            <tr key={m.mechanicId}>
              <td>{m.mechanicName}</td>
              <td>{m.activeOrdersCount}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setSelectedId(m.mechanicId)}
                >
                  Wybierz
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>
          Anuluj
        </button>
        <button
          className="btn btn-primary"
          disabled={!selectedId}
          onClick={handleAssign}
        >
          Przypisz
        </button>
      </div>
    </Modal>
  );
}

window.AssignMechanicModal = AssignMechanicModal;
