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
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Imię"
          required
        />

        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Nazwisko"
          required
        />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="EMPLOYEE">Pracownik</option>
          <option value="MECHANIC">Mechanik</option>
          <option value="ADMIN">Administrator</option>
        </select>

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
