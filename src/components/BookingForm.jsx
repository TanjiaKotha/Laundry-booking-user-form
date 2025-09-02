// src/components/BookingForm.jsx

import { useState, useEffect, useMemo } from 'react';
import useServices from '../hooks/useServices';
import usePickupSlots from '../hooks/usePickupSlots';
import useOrderSubmission from '../hooks/useOrderSubmission';
// ❌ No longer need ServiceCard
// import ServiceCard from './ServiceCard';
// ✅ Import ServiceCategory instead
import ServiceCategory from './ServiceCategory';
import PickupOptions from './PickupOptions';
import Totals from './Totals';
import Confirmation from './Confirmation';

function BookingForm() {
  const { services, loading: servicesLoading } = useServices();
  const slots = usePickupSlots();

  const [room, setRoom] = useState('');
  const [slot, setSlot] = useState('');
  const [pickup, setPickup] = useState('');
  // The shape of this state is an array of objects: { item: {...}, quantity: number }
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const { submitOrder, loading: isSubmitting, error, data: orderData } = useOrderSubmission();

  const uniforms = services.filter(s => s.slug && s.slug.includes(''));
  const other = services.filter(s => s.slug && !s.slug.includes('uniform'));

  const total = useMemo(() =>
    selectedItems.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0),
    [selectedItems]
  );

  useEffect(() => {
    if (orderData) {
      setConfirmed(true);
    }
  }, [orderData]);

  // ✅ NEW: This function handles adding, updating, and removing items from the cart.
  const handleQuantityChange = (itemToUpdate, newQuantity) => {
    setSelectedItems(prevItems => {
      const existingEntryIndex = prevItems.findIndex(entry => entry.item.id === itemToUpdate.id);
      const newItems = [...prevItems];

      // If quantity is 0 or less, remove the item
      if (newQuantity <= 0) {
        if (existingEntryIndex > -1) {
          newItems.splice(existingEntryIndex, 1);
        }
      } else {
        // If item exists, update its quantity
        if (existingEntryIndex > -1) {
          newItems[existingEntryIndex] = { ...newItems[existingEntryIndex], quantity: newQuantity };
        } else {
          // If item doesn't exist, add it to the cart
          newItems.push({ item: itemToUpdate, quantity: newQuantity });
        }
      }
      return newItems;
    });
  };

  const handleRemoveItem = (itemIdToRemove) => {
    setSelectedItems(prev => prev.filter(entry => entry.item.id !== itemIdToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!room || !slot || !pickup || selectedItems.length === 0) {
      alert('Please complete all fields and select at least one service.');
      return;
    }
    const servicesPayload = selectedItems.map(entry => ({
      name: entry.item.name,
      quantity: entry.quantity,
      price: entry.item.price,
    }));
    const bookingPayload = {
      title: `Laundry Order for Room ${room}`,
      status: 'pending',
      fields: {
        room_number: room,
        pickup_slot: slot,
        pickup_method: pickup,
        services: JSON.stringify(servicesPayload),
        total_price: total.toFixed(2),
      },
    };
    await submitOrder(bookingPayload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid two">
        <div className="field">
          <label htmlFor="room">Room Number *</label>
          <input type="text" id="room" value={room} onChange={(e) => setRoom(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="slot">Pickup Time Slot *</label>
          <select id="slot" value={slot} onChange={(e) => setSlot(e.target.value)} required>
            <option value="" disabled>Select a time slot</option>
            {slots.map(s => <option key={s.id} value={s.time}>{s.time}</option>)}
          </select>
        </div>
      </div>

      {servicesLoading ? <p className="text-center my-8">Loading services...</p> : (
        <>
          {/* ✅ RENDER ServiceCategory instead of ServiceCard */}
          <ServiceCategory
            title="Uniforms"
            items={uniforms}
            selectedItems={selectedItems}
            onQuantityChange={handleQuantityChange}
          />
          <ServiceCategory
            title="Uniform"
            items={other}
            selectedItems={selectedItems}
            onQuantityChange={handleQuantityChange}
          />
        </>
      )}

      <div className="grid two mt-6">
        <PickupOptions pickup={pickup} setPickup={setPickup} />
        <div className="grid gap-4">
          <Totals selectedItems={selectedItems} slot={slot} onRemoveItem={handleRemoveItem} />
          <div className="actions">
            <button type="submit" className="pay-btn alt w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      
      <div className={`confirm ${confirmed ? 'active' : ''}`}>
        <Confirmation
          orderId={orderData?.id}
          room={room}
          slot={slot}
          pickup={pickup}
          selectedItems={selectedItems}
          total={total}
        />
      </div>
    </form>
  );
}

export default BookingForm;
