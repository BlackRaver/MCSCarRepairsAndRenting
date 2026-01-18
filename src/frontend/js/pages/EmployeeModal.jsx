function EmployeeModal({ isOpen, onClose, onSave, employee }) {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    role: "EMPLOYEE",
  });

  React.useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        role: "EMPLOYEE",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? "Edytuj pracownika" : "Nowy pracownik"}
    >
      <form onSubmit={handleSubmit}>
        {/* PIERWSZA KOLUMNA: Imię i Nazwisko */}
        <div className="form-row">
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
        </div>

        {/* DRUGA KOLUMNA: Rola */}
        <div className="form-group">
          <label className="form-label">Rola</label>
          <select
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Wybierz rolę</option>
            <option value="RECEPTIONIST">Pracownik Recepcji</option>
            <option value="MECHANIC">Mechanik</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        {/* STOPKA MODALA */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Anuluj
          </button>
          <button type="submit" className="btn btn-success">
            Zapisz
          </button>
        </div>
      </form>
    </Modal>
  );
}

window.EmployeeModal = EmployeeModal;
