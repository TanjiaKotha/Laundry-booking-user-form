function Totals({ selectedItems, slot }) {
  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="totals">
      <div>
        <strong>Selected Service:</strong>{" "}
        {selectedItems.map((i) => i.name).join(", ") || "None"}
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
