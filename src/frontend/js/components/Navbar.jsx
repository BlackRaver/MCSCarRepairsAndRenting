/**
 * Navbar - Komponent nawigacji
 * 
 * Wyświetla logo i przyciski do przełączania między stronami
 * 
 * @param {string} currentPage - Aktualnie wybrana strona ('clients'|'vehicles'|'orders')
 * @param {function} onNavigate - Funkcja wywoływana przy zmianie strony
 */
function Navbar({ currentPage, onNavigate }) {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="icon">🔧</span>
                <span>AutoSerwis</span>
            </div>
            <div className="navbar-nav">
                <button
                    className={`nav-link ${currentPage === 'clients' ? 'active' : ''}`}
                    onClick={() => onNavigate('clients')}
                >
                    👥 Klienci
                </button>
                <button
                    className={`nav-link ${currentPage === 'vehicles' ? 'active' : ''}`}
                    onClick={() => onNavigate('vehicles')}
                >
                    🚗 Pojazdy
                </button>
                <button
                    className={`nav-link ${currentPage === 'orders' ? 'active' : ''}`}
                    onClick={() => onNavigate('orders')}
                >
                    📋 Zlecenia
                </button>
            </div>
        </nav>
    );
}

// Udostępnij globalnie
window.Navbar = Navbar;
