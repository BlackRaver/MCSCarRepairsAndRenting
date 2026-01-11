function App() {
  const { role } = React.useContext(AuthContext);
  const [currentPage, setCurrentPage] = React.useState("clients");

  // 🔒 Jeśli nie wybrano roli → pokaż panel startowy
  if (!role) {
    return <RoleSelectPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "clients":
        return <ClientsPage />;
      case "employees":
        return <EmployeesPage />;
      case "vehicles":
        return <VehiclesPage />;
      case "orders":
        return <OrdersPage />;
      default:
        return <ClientsPage />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

// Renderowanie aplikacji
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
