function RoleSelectPage() {
    const { setRole } = React.useContext(AuthContext);

    const chooseRole = (role) => {
        setRole(role);
    };

    return (
        <div className="role-select-page">
            <h1>🔧 System Warsztatu</h1>
            <p>Wybierz tryb pracy</p>

            <div className="role-grid">
                <button onClick={() => chooseRole('ADMIN')} className="role-card">
                    👑 Administrator
                    <small>Pełny dostęp</small>
                </button>

                <button onClick={() => chooseRole('EMPLOYEE')} className="role-card">
                    🧑‍🔧 Pracownik
                    <small>Dodawanie i edycja danych</small>
                </button>

                <button onClick={() => chooseRole('CLIENT')} className="role-card">
                    🚗 Klient
                    <small>Tylko podgląd</small>
                </button>
            </div>
        </div>
    );
}

window.RoleSelectPage = RoleSelectPage;
