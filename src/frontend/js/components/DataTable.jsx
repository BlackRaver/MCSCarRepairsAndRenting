/**
 * DataTable - Uniwersalna tabela danych
 * 
 * Wyświetla dane w tabeli z przyciskami Edytuj/Usuń
 * 
 * @param {Array} columns - Definicje kolumn [{ key: 'field', label: 'Nazwa' }]
 * @param {Array} data - Tablica obiektów do wyświetlenia
 * @param {function} onEdit - Funkcja wywoływana przy kliknięciu Edytuj (przekazuje cały obiekt)
 * @param {function} onDelete - Funkcja wywoływana przy kliknięciu Usuń (przekazuje id)
 * @param {function} renderCell - Opcjonalna funkcja do customowego renderowania komórek
 *                                Parametry: (key, value, row) => ReactNode
 */
function DataTable({ columns, data, onEdit, onDelete, onContact, renderCell }) {
    return (
        <table className="data-table">
            <thead>
                <tr>
                    {columns.map(col => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                    <th>Akcje</th>
                </tr>
            </thead>
            <tbody>
                {data.map(row => (
                    <tr key={row.id}>
                        {columns.map(col => (
                            <td key={col.key}>
                                {renderCell
                                    ? renderCell(col.key, row[col.key], row)
                                    : row[col.key]}
                            </td>
                        ))}
                        <td className="actions">
                            <button onClick={() => onEdit(row)}>✏️</button>
                            <button onClick={() => onDelete(row.id)}>🗑️</button>
                            {onContact && (
                                <button onClick={() => onContact(row)}>📞</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// Udostępnij globalnie
window.DataTable = DataTable;
