// src/components/BookingForm.jsx

import { useState, useEffect } from 'react';
import useServices from '../hooks/useServices'; // Re-enabled
import usePickupSlots from '../hooks/usePickupSlots';
import usePaymentMethods from '../hooks/usePaymentMethods';
import useOrderSubmission from '../hooks/useOrderSubmission';
import ServiceGrid from './ServiceGrid'; // <-- Use new grid component
import PickupOptions from './PickupOptions';
import Totals from './Totals';
import PaymentButtons from './PaymentButtons';
import Confirmation from './Confirmation';

function BookingForm() {
  const { services, loading: servicesLoading } = useServices(); // Re-enabled
  const slots = usePickupSlots();
  const paymentMethods = usePaymentMethods();

  const [room, setRoom] = useState('');
  const [slot, setSlot] = useState('');
  const [pickup, setPickup] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  
  const { submitOrder, loading: isSubmitting, error, data: orderData } = useOrderSubmission();

  const uniforms = services.filter(s => s.slug.includes('uniform'));
  const clothing = services.filter(s => !s.slug.includes('uniform'));
  
  useEffect(() => {
    if (orderData) {
      setConfirmed(true);
    }
  }, [orderData]);

  // ✅ New handler for the "Add to Cart" button in the cards
  const handleAddToCart = (itemToAdd, quantity) => {
    setSelectedItems(prevItems => {
      const newItems = [...prevItems];
      const existingItemIndex = newItems.findIndex(i => i.item.id === itemToAdd.id);
      
      if (existingItemIndex > -1) {
        // If item already exists, just update its quantity
        newItems[existingItemIndex].quantity = quantity;
      } else {
        // Otherwise, add it as a new item
        newItems.push({ item: itemToAdd, quantity: quantity });
      }
      return newItems;
    });
    alert(`${quantity} x ${itemToAdd.name} has been added/updated in your selections!`);
  };

  // ✅ New handler to remove an item from the Totals summary
  const handleRemoveItem = (itemIdToRemove) => {
    setSelectedItems(prevItems => prevItems.filter(i => i.item.id !== itemIdToRemove));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!room || !slot || !pickup || selectedItems.length === 0) {
      alert('Please complete all fields and select at least one service.');
      return;
    }
    const bookingPayload = {
      title: 'Laundry Order for Room ' + room,
      status: 'pending',
      fields: {
        room_number: room,
        pickup_slot: slot,
        pickup_method: pickup,
        services: selectedItems.map(entry => `${entry.item.name} (x${entry.quantity})`).join(', '),
      },
    };
    await submitOrder(bookingPayload);
  };

  if (confirmed) {
    return (
      <Confirmation orderId={orderData.id} room={room} slot={slot} pickup={pickup} />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {/* Room Number and Pickup Time Slot fields remain the same */}
      <div className="form-row">
        {/* ... */}
      </div>

      {servicesLoading ? (
        <p className="text-gray-400 text-center">Loading services...</p>
      ) : (
        <>
          {/* ✅ Using the new ServiceGrid component */}
          <ServiceGrid
            title="Uniform"
            items={uniforms}
            selectedItems={selectedItems}
            onAddToCart={handleAddToCart}
          />
          <ServiceGrid
            title="Other clothing"
            items={clothing}
            selectedItems={selectedItems}
            onAddToCart={handleAddToCart}
          />
        </>
      )}

      <PickupOptions pickup={pickup} setPickup={setPickup} />
      
      {/* ✅ Pass the new remove handler to Totals */}
      <Totals selectedItems={selectedItems} slot={slot} onRemoveItem={handleRemoveItem} />
      
      <PaymentButtons methods={paymentMethods} />
      
      <div className="actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Booking'}
        </button>
      </div>
      
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </form>
  );
}

export default BookingForm;
