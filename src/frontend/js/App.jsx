/**
 * App - Główny komponent aplikacji
 * 
 * Zarządza stanem nawigacji i renderuje odpowiednią stronę
 */
function App() {
    // Aktualnie wybrana strona
    const [currentPage, setCurrentPage] = React.useState('clients');

    // Renderuj odpowiednią stronę
    const renderPage = () => {
        switch (currentPage) {
            case 'clients':
                return <ClientsPage />;
            case 'vehicles':
                return <VehiclesPage />;
            case 'orders':
                return <OrdersPage />;
            default:
                return <ClientsPage />;
        }
    };

    return (
        <div className="app">
            <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className="main-content">
                {renderPage()}
            </main>
        </div>
    );
}

// Renderowanie aplikacji do DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
