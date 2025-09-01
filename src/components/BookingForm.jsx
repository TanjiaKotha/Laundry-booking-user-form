import { useState } from 'react';
import useServices from '../hooks/useServices';
import usePickupSlots from '../hooks/usePickupSlots';
import usePaymentMethods from '../hooks/usePaymentMethods';
import ServiceCategory from './ServiceCategory';
import PickupOptions from './PickupOptions';
import Totals from './Totals';
import PaymentButtons from './PaymentButtons';
import Confirmation from './Confirmation';

function BookingForm() {
  const { services, loading } = useServices();
  const slots = usePickupSlots();
  const paymentMethods = usePaymentMethods();

  const [room, setRoom] = useState('');
  const [slot, setSlot] = useState('');
  const [pickup, setPickup] = useState('');
  const [selectedItems, setSelectedItems] = useState([]); // State now holds objects with item and quantity
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Filtering services based on slugs
  const uniforms = services.filter(s => s.slug.includes('uniform'));
  const otherClothing = services.filter(s => !s.slug.includes('other'));

  const handleQuantityChange = (item, quantity) => {
    if (quantity <= 0) {
      setSelectedItems(selectedItems.filter(i => i.item.id !== item.id));
    } else {
      const exists = selectedItems.find(i => i.item.id === item.id);
      if (exists) {
        setSelectedItems(
          selectedItems.map(i =>
            i.item.id === item.id ? { ...i, quantity } : i
          )
        );
      } else {
        setSelectedItems([...selectedItems, { item, quantity }]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!room || !slot || !pickup || selectedItems.length === 0) {
      alert('Please complete all fields and select at least one service.');
      return;
    }

    // Placeholder for API submission to WordPress backend
    const id = 'AMA-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    setOrderId(id);
    setConfirmed(true);
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="fields">
        <div className="field">
          <label htmlFor="room">Room Number *</label>
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
            placeholder="e.g. 101"
          />
        </div>

        <div className="field">
          <label htmlFor="slot">Pickup Time Slot *</label>
          <select
            id="slot"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            required
          >
            <option value="" disabled>Select a time slot</option>
            {slots.map(s => (
              <option key={s.id} value={s.time}>{s.time}</option>
            ))}
          </select>
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
            onQuantityChange={handleQuantityChange}
          />
          <ServiceCategory
            title="Other Clothing"
            items={otherClothing}
            selectedItems={selectedItems}
            onQuantityChange={handleQuantityChange}
          />
        </>
      )}

      <PickupOptions pickup={pickup} setPickup={setPickup} />
      <Totals selectedItems={selectedItems} slot={slot} />
      <PaymentButtons methods={paymentMethods} />
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
