// /**
//  * VehiclesPage - Strona zarządzania pojazdami
//  * 
//  * Funkcje:
//  * - Wyświetlanie listy pojazdów w tabeli
//  * - Wyszukiwanie pojazdów
//  * - Dodawanie nowych pojazdów z przypisaniem do klienta
//  * - Edycja istniejących pojazdów
//  * - Usuwanie pojazdów
//  */
// function VehiclesPage() {
//     // Stan komponentu
//     const [vehicles, setVehicles] = React.useState([]);
//     const [clients, setClients] = React.useState([]);
//     const [isModalOpen, setIsModalOpen] = React.useState(false);
//     const [editingVehicle, setEditingVehicle] = React.useState(null);
//     const [searchQuery, setSearchQuery] = React.useState('');
//     const [formData, setFormData] = React.useState({
//         brand: '',
//         model: '',
//         year: '',
//         vin: '',
//         clientId: ''
//     });

//     // Definicja kolumn tabeli
//     const columns = [
//         { key: 'brand', label: 'Marka' },
//         { key: 'model', label: 'Model' },
//         { key: 'year', label: 'Rocznik' },
//         { key: 'vin', label: 'VIN' },
//         { key: 'clientId', label: 'Właściciel' }
//     ];

//     // Pobranie danych przy montowaniu
//     React.useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         const [vehiclesData, clientsData] = await Promise.all([
//             window.apiService.getVehicles(),
//             window.apiService.getClients()
//         ]);
//         setVehicles(vehiclesData);
//         setClients(clientsData);
//     };

//     // Helper - pobierz nazwę klienta po ID
//     const getClientName = (clientId) => {
//         const client = clients.find(c => c.id === clientId);
//         return client ? `${client.firstName} ${client.lastName}` : 'Nieznany';
//     };

//     // Customowe renderowanie komórek (dla właściciela)
//     const renderCell = (key, value) => {
//         if (key === 'clientId') {
//             return getClientName(value);
//         }
//         return value;
//     };

//     // Filtrowanie pojazdów
//     const filteredVehicles = vehicles.filter(v => {
//         const query = searchQuery.toLowerCase();
//         const clientName = getClientName(v.clientId).toLowerCase();
//         return v.brand.toLowerCase().includes(query) ||
//             v.model.toLowerCase().includes(query) ||
//             v.vin.toLowerCase().includes(query) ||
//             v.year.toString().includes(query) ||
//             clientName.includes(query);
//     });

//     // Obsługa formularza
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const data = {
//             ...formData,
//             year: parseInt(formData.year),
//             clientId: parseInt(formData.clientId)
//         };

//         if (editingVehicle) {
//             await window.apiService.updateVehicle(editingVehicle.id, data);
//         } else {
//             await window.apiService.createVehicle(data);
//         }
//         await loadData();
//         closeModal();
//     };

//     const handleEdit = (vehicle) => {
//         setEditingVehicle(vehicle);
//         setFormData({
//             brand: vehicle.brand,
//             model: vehicle.model,
//             year: vehicle.year.toString(),
//             vin: vehicle.vin,
//             clientId: vehicle.clientId.toString()
//         });
//         setIsModalOpen(true);
//     };

//     const handleDelete = async (id) => {
//         if (confirm('Czy na pewno chcesz usunąć ten pojazd?')) {
//             await window.apiService.deleteVehicle(id);
//             await loadData();
//         }
//     };

//     const openAddModal = () => {
//         setEditingVehicle(null);
//         setFormData({ brand: '', model: '', year: '', vin: '', clientId: '' });
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setEditingVehicle(null);
//     };

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     return (
//         <div>
//             {/* Nagłówek strony */}
//             <div className="page-header">
//                 <h1 className="page-title">🚗 Pojazdy</h1>
//                 <div className="header-actions">
//                     <SearchBox
//                         value={searchQuery}
//                         onChange={setSearchQuery}
//                         placeholder="Szukaj pojazdów..."
//                     />
//                     <button className="btn btn-primary" onClick={openAddModal}>
//                         ➕ Dodaj pojazd
//                     </button>
//                 </div>
//             </div>

//             {/* Licznik wyników */}
//             {searchQuery && (
//                 <p className="results-count">
//                     Znaleziono: {filteredVehicles.length} z {vehicles.length}
//                 </p>
//             )}

//             {/* Tabela pojazdów */}
//             <DataTable
//                 columns={columns}
//                 data={filteredVehicles}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 renderCell={renderCell}
//             />

//             {/* Modal formularza */}
//             <Modal
//                 isOpen={isModalOpen}
//                 onClose={closeModal}
//                 title={editingVehicle ? 'Edytuj pojazd' : 'Nowy pojazd'}
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">Marka</label>
//                         <input
//                             type="text"
//                             name="brand"
//                             className="form-input"
//                             value={formData.brand}
//                             onChange={handleChange}
//                             placeholder="np. Volkswagen"
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">Model</label>
//                         <input
//                             type="text"
//                             name="model"
//                             className="form-input"
//                             value={formData.model}
//                             onChange={handleChange}
//                             placeholder="np. Golf VII"
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">Rocznik</label>
//                         <input
//                             type="number"
//                             name="year"
//                             className="form-input"
//                             value={formData.year}
//                             onChange={handleChange}
//                             placeholder="2020"
//                             min="1900"
//                             max="2030"
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">VIN</label>
//                         <input
//                             type="text"
//                             name="vin"
//                             className="form-input"
//                             value={formData.vin}
//                             onChange={handleChange}
//                             placeholder="Numer VIN pojazdu"
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">Właściciel</label>
//                         <select
//                             name="clientId"
//                             className="form-select"
//                             value={formData.clientId}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Wybierz klienta...</option>
//                             {clients.map(client => (
//                                 <option key={client.id} value={client.id}>
//                                     {client.firstName} {client.lastName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="modal-footer">
//                         <button type="button" className="btn btn-secondary" onClick={closeModal}>
//                             Anuluj
//                         </button>
//                         <button type="submit" className="btn btn-success">
//                             {editingVehicle ? 'Zapisz zmiany' : 'Dodaj pojazd'}
//                         </button>
//                     </div>
//                 </form>
//             </Modal>
//         </div>
//     );
// }

// // Udostępnij globalnie
// window.VehiclesPage = VehiclesPage;
