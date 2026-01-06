function DataTable({ columns, data, onEdit, onDelete, onContact, renderCell }) {
    return (
        <table className="data-table">
            <thead>
                <tr>
                    {columns.map(col => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                    {(onEdit || onDelete || onContact) && <th>Akcje</th>}
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

                        {(onEdit || onDelete || onContact) && (
                            <td className="actions">
                                {onEdit && (
                                    <button onClick={() => onEdit(row)}>
                                        ✏️
                                    </button>
                                )}

                                {onDelete && (
                                    <button onClick={() => onDelete(row.id)}>
                                        🗑️
                                    </button>
                                )}

                                {onContact && (
                                    <button onClick={() => onContact(row)}>
                                        📞
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

window.DataTable = DataTable;
