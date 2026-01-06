const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const [role, setRole] = React.useState(null);

    const permissions = React.useMemo(() => ({
        isAdmin: role === 'ADMIN',
        canWrite: role === 'ADMIN' || role === 'EMPLOYEE',
        canRead: role !== null
    }), [role]);

    return (
        <AuthContext.Provider value={{ role, setRole, ...permissions }}>
            {children}
        </AuthContext.Provider>
    );
}

window.AuthContext = AuthContext;
window.AuthProvider = AuthProvider;
