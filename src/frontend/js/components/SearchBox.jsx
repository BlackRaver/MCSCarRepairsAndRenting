/**
 * SearchBox - Pole wyszukiwania
 * 
 * Uniwersalne pole tekstowe do filtrowania danych w tabelach
 * 
 * @param {string} value - Aktualna wartość wyszukiwania
 * @param {function} onChange - Funkcja wywoływana przy zmianie tekstu
 * @param {string} placeholder - Tekst placeholder (domyślnie "Szukaj...")
 */
function SearchBox({ value, onChange, placeholder }) {
    return (
        <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                className="search-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Szukaj..."}
            />
        </div>
    );
}

// Udostępnij globalnie
window.SearchBox = SearchBox;
