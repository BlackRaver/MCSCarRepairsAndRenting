function OrderItemModal({ isOpen, onClose, onSaved, orderId }) {
  const [type, setType] = React.useState("TASK");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);

  if (!isOpen) return null;

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);

    if (newType === "TASK") {
      setQuantity(1); // nieistotne, ale porządek
    }

    if (newType === "PART") {
      setQuantity(1); // sensowna wartość domyślna
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      type,
      description,
      price: Number(price),
    };

    if (type === "PART" && (!quantity || quantity < 1)) {
      alert("Ilość musi być większa od 0");
      return;
    }

    if (type === "PART") {
      payload.quantity = Number(quantity);
    }

    await window.apiService.addOrderItem(orderId, payload);

    onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dodaj pozycję">
      <form onSubmit={handleSubmit}>
        {/* TYP POZYCJI */}
        <div className="form-group">
          <label className="form-label">Typ pozycji</label>
          <select
            name="type"
            className="form-select"
            value={type}
            onChange={handleTypeChange}
            required
          >
            <option value="TASK">Czynność</option>
            <option value="PART">Część</option>
          </select>
        </div>

        {/* OPIS */}
        <div className="form-group">
          <label className="form-label">Opis</label>
          <input
            name="description"
            className="form-input"
            placeholder="Opis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* CENA */}
        <div className="form-group">
          <label className="form-label">Cena</label>
          <input
            name="price"
            type="number"
            className="form-input"
            placeholder="Cena"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* ILOŚĆ – tylko dla części */}
        {type === "PART" && (
          <div className="form-group">
            <label className="form-label">Ilość</label>
            <input
              name="quantity"
              type="number"
              className="form-input"
              placeholder="Ilość"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              min="1"
            />
          </div>
        )}

        {/* STOPKA MODALA */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Anuluj
          </button>
          <button type="submit" className="btn btn-success">
            Zapisz
          </button>
        </div>
      </form>
    </Modal>

  );
}

window.OrderItemModal = OrderItemModal;
