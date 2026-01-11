/**
 * EmployeesPage – lista pracowników
 * Widoczna dla EMPLOYEE i ADMIN
 */

function EmployeesPage() {
  const { role } = React.useContext(AuthContext);

  const isClient = role === "CLIENT";
  const isAdmin = role === "ADMIN";

  const [employees, setEmployees] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState(null);

  React.useEffect(() => {
    if (!isClient) {
      loadEmployees();
    }
  }, []);

  const loadEmployees = async () => {
    const data = await window.apiService.getEmployees();
    setEmployees(Array.isArray(data) ? data : []);
  };

  if (isClient) return null;

  // ===== KOLUMNY =====
  const columns = [
    { key: "name", label: "Imię i nazwisko" },
    { key: "role", label: "Rola" },
  ];

  // ===== RENDER KOMÓREK =====
  const renderCell = (key, value, row) => {
    if (key === "name") {
      return `${row.firstName} ${row.lastName}`;
    }

    if (key === "role") {
      return row.role;
    }

    return value;
  };

  // ===== FILTROWANIE =====
  const filteredEmployees = employees.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q)
    );
  });

  // ===== MODAL =====
  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    if (!isAdmin) return;
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSave = async (data) => {
    if (editingEmployee) {
      await window.apiService.updateEmployee(editingEmployee.id, data);
    } else {
      await window.apiService.createEmployee(data);
    }

    await loadEmployees();
    closeModal();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👷 Pracownicy</h1>
        <div className="header-actions">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Szukaj pracownika..."
          />

          {isAdmin && (
            <button className="btn btn-primary" onClick={openAddModal}>
              ➕ Dodaj pracownika
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredEmployees}
        renderCell={renderCell}
        onEdit={isAdmin ? openEditModal : undefined}
      />

      {/* ===== MODAL FORMULARZA ===== */}
      {isAdmin && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
          employee={editingEmployee}
        />
      )}
    </div>
  );
}

window.EmployeesPage = EmployeesPage;
