import { useState } from "react";
import useServices from "../hooks/useServices";
import ServiceCategory from "./ServiceCategory";
import PickupOptions from "./PickupOptions";
import Totals from "./Totals";
import PaymentButtons from "./PaymentButtons";
import Confirmation from "./Confirmation";

const ADMIN_SLOTS = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

function BookingForm() {
  const { services, loading } = useServices();
  const [room, setRoom] = useState("");
  const [slot, setSlot] = useState("");
  const [pickup, setPickup] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  const uniforms = services.filter((item) =>
    item.slug?.toLowerCase().includes("high-vis")
  );
  const clothing = services.filter(
    (item) => !item.slug?.toLowerCase().includes("high-vis")
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!room || !slot || !pickup) {
      alert("Please fill all required fields.");
      return;
    }
    const id = "AMA-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setOrderId(id);
    setConfirmed(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid two">
        <div className="field">
          <label htmlFor="room">Room Number *</label>
          <input
            id="room"
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="e.g., B-214"
            required
          />
          <span className="hint">Mandatory for pickup & delivery.</span>
        </div>
        <div className="field">
          <label htmlFor="slot">Pickup Time Slot *</label>
          <select
            id="slot"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a time slot
            </option>
            {ADMIN_SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="hint">
            Only shows the time windows you make available.
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading services...</p>
      ) : (
        <>
          <ServiceCategory
            title="Uniforms"
            items={uniforms}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
          <ServiceCategory
            title="Other Clothing"
            items={clothing}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </>
      )}

      <PickupOptions pickup={pickup} setPickup={setPickup} />
      <Totals selectedItems={selectedItems} slot={slot} />
      <PaymentButtons />
      <div className="actions">
        <button type="submit">Submit Booking</button>
      </div>
      {confirmed && (
        <Confirmation
          orderId={orderId}
          room={room}
          slot={slot}
          pickup={pickup}
        />
      )}
    </form>
  );
}

export default BookingForm;
