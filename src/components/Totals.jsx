function Totals({ selectedItems, slot }) {
  const total = selectedItems.reduce((sum, entry) => {
    return sum + (entry.item.price * entry.quantity);
  }, 0);

  return (
    <div className="totals">
      <div>
        <strong>Selected Service:</strong>{" "}
        {selectedItems.map((entry) => `${entry.item.name} (x${entry.quantity})`).join(", ") || "None"}
      </div>
      <div>
        <strong>Pickup Slot:</strong> {slot || "—"}
      </div>
      <div>
        <strong>Total Price:</strong> ${total || "—"}
      </div>
    </div>
  );
}

export default Totals;
