/**
 * Modal - Okno modalne
 * 
 * Wyświetla zawartość w overlay'u. Zamyka się po kliknięciu tła lub przycisku X.
 * 
 * @param {boolean} isOpen - Czy modal jest otwarty
 * @param {function} onClose - Funkcja zamykająca modal
 * @param {string} title - Tytuł w nagłówku
 * @param {boolean} large - Czy użyć większej szerokości (dla formularzy)
 * @param {ReactNode} children - Zawartość modala
 */
function Modal({ isOpen, onClose, title, children, large }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal ${large ? 'modal-lg' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Udostępnij globalnie
window.Modal = Modal;
