// src/components/BookingForm.jsx

import { useState, useEffect, useMemo } from 'react';
import useServices from '../hooks/useServices';
import usePickupSlots from '../hooks/usePickupSlots';
import useOrderSubmission from '../hooks/useOrderSubmission';
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const { submitOrder, loading: isSubmitting, error, data: orderData } = useOrderSubmission();

  const uniforms = services.filter(s => s.slug === 'uniform');
  const other = services.filter(s => s.slug === 'cloth');

  const total = useMemo(() =>
    selectedItems.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0),
    [selectedItems]
  );

  useEffect(() => {
    if (orderData) {
      setConfirmed(true);
    }
  }, [orderData]);

  const handleQuantityChange = (itemToUpdate, newQuantity) => {
    setSelectedItems(prevItems => {
      const existingEntryIndex = prevItems.findIndex(entry => entry.item.id === itemToUpdate.id);
      const newItems = [...prevItems];

      if (newQuantity <= 0) {
        if (existingEntryIndex > -1) {
          newItems.splice(existingEntryIndex, 1);
        }
      } else {
        if (existingEntryIndex > -1) {
          newItems[existingEntryIndex] = { ...newItems[existingEntryIndex], quantity: newQuantity };
        } else {
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
    
    // Create a detailed payload for storing as a JSON string
    const servicesDetailsPayload = selectedItems.map(entry => ({
      id: entry.item.id,
      name: entry.item.name,
      quantity: entry.quantity,
      price: entry.item.price,
    }));

    // Find the full slot object to get its time string for display/reference
    const selectedSlotObject = slots.find(s => s.id == slot);
    const selectedSlotTime = selectedSlotObject ? selectedSlotObject.time : '';


    const bookingPayload = {
      title: `Laundry Order for Room ${room}`,
      status: 'pending',
      fields: {
        room_number: room,
        // Send the slot ID and the original time string separately
        slot_id: slot, // This is now the ID
        pickup_slot: selectedSlotTime, // Keep the original time string
        pickup_method: pickup,
        // Keep the detailed JSON, but also prepare a simple array of IDs
        services: JSON.stringify(servicesDetailsPayload), 
        service_id: selectedItems.map(entry => entry.item.id), // Send just the IDs
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
          {/* The value of the option is now s.id */}
          <select id="slot" value={slot} onChange={(e) => setSlot(e.target.value)} required>
            <option value="" disabled>Select a time slot</option>
            {slots.map(s => <option key={s.id} value={s.id}>{s.time}</option>)}
          </select>
        </div>
      </div>

      {servicesLoading ? <p className="text-center my-8">Loading services...</p> : (
        <>
         <ServiceCategory
            title="Uniform"
            items={uniforms}
            selectedItems={selectedItems}
            onQuantityChange={handleQuantityChange}
          />
          <ServiceCategory
            title="Other Clothing"
            items={other}
            selectedItems={selectedItems}
            onQuantityChange={handleQuantityChange}
          />
        </>
      )}

      <div className="grid two mt-6">
        <PickupOptions pickup={pickup} setPickup={setPickup} />
        <div className="grid gap-4">
          <Totals 
            selectedItems={selectedItems} 
            room={room} 
            slot={slots.find(s => s.id == slot)?.time || ''} // Find time from ID for display
            pickup={pickup} 
            onRemoveItem={handleRemoveItem} 
          />
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
          slot={slots.find(s => s.id == slot)?.time || ''} // Find time from ID for display
          pickup={pickup}
          selectedItems={selectedItems}
          total={total}
        />
      </div>
    </form>
  );
}

export default BookingForm;
