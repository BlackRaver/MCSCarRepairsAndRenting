function App() {
  const { role } = React.useContext(AuthContext);

  const [currentPage, setCurrentPage] = React.useState("clients");
  const [pageParams, setPageParams] = React.useState(null);

  React.useEffect(() => {
    window.appNavigate = (page, params = null) => {
      setCurrentPage(page);
      setPageParams(params);
    };
  }, []);

  if (!role) {
    return <RoleSelectPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "orders":
        return <OrdersPage />;
      case "orderDetails":
        return <OrderDetailsPage orderId={pageParams?.orderId} />;
      case "clients":
        return <ClientsPage />;
      case "vehicles":
        return <VehiclesPage />;
      case "employees":
        return <EmployeesPage />;
      default:
        return <OrdersPage />;
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
  </AuthProvider>,
);
