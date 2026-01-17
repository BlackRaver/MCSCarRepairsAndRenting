function RoleSelectPage() {
    const { setRole } = React.useContext(AuthContext);

    const chooseRole = (role) => {
        setRole(role);
    };

    return (
        <div className="role-select-page" style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧 System Warsztatu</h1>
            <p style={{ marginBottom: '2rem', color: '#94a3b8' }}>Wybierz tryb pracy</p>

            <div className="role-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                
                {/* Administrator */}
                <button onClick={() => chooseRole('ADMIN')} className="role-card" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem',
                    background: '#1e293b', borderRadius: '8px', color: '#f8fafc', border: '1px solid #475569', cursor: 'pointer'
                }}>
                    <span className="role-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👑</span>
                    <span className="role-title" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Administrator</span>
                    <small className="role-desc" style={{ color: '#94a3b8' }}>Pełny dostęp</small>
                </button>

                {/* Pracownik */}
                <button onClick={() => chooseRole('EMPLOYEE')} className="role-card" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem',
                    background: '#1e293b', borderRadius: '8px', color: '#f8fafc', border: '1px solid #475569', cursor: 'pointer'
                }}>
                    <span className="role-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧑‍🔧</span>
                    <span className="role-title" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Pracownik</span>
                    <small className="role-desc" style={{ color: '#94a3b8' }}>Dodawanie i edycja danych</small>
                </button>

                {/* Klient */}
                <button onClick={() => chooseRole('CLIENT')} className="role-card" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem',
                    background: '#1e293b', borderRadius: '8px', color: '#f8fafc', border: '1px solid #475569', cursor: 'pointer'
                }}>
                    <span className="role-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚗</span>
                    <span className="role-title" style={{ fontWeight: 600, fontSize: '1.1rem' }}>Klient</span>
                    <small className="role-desc" style={{ color: '#94a3b8' }}>Tylko podgląd</small>
                </button>

            </div>
        </div>
    );
}

window.RoleSelectPage = RoleSelectPage;
