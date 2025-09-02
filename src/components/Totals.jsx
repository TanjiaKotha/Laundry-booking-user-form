// src/components/Totals.jsx

function Totals({ selectedItems, slot, onRemoveItem }) {
  const total = selectedItems.reduce((sum, entry) => {
    return sum + (entry.item.price * entry.quantity);
  }, 0);

  return (
    <div className="totals">
      <h3>Your Selections</h3>
      <ul className="selected-items-list">
        {selectedItems.length > 0 ? (
          selectedItems.map((entry) => (
            <li key={entry.item.id}>
              <span>{`${entry.item.name} (x${entry.quantity})`} - ৳${entry.item.price * entry.quantity}</span>
              {/* ✅ Added remove button */}
              <button type="button" className="remove-item-btn" onClick={() => onRemoveItem(entry.item.id)}>
                Remove
              </button>
            </li>
          ))
        ) : (
          <p>No services selected yet.</p>
        )}
      </ul>
      <hr />
      <div className="totals-summary">
        <strong>Pickup Slot:</strong> {slot || "—"}
      </div>
      <div className="totals-summary">
        <strong>Total Price:</strong> ৳{total.toFixed(2) || "0.00"}
      </div>
    </div>
  );
}

export default Totals;
