// src/components/BookingForm.jsx

import { useState, useEffect } from 'react';
import useServices from '../hooks/useServices';
import usePickupSlots from '../hooks/usePickupSlots';
import usePaymentMethods from '../hooks/usePaymentMethods';
import useOrderSubmission from '../hooks/useOrderSubmission';
import ServiceCard from './ServiceCard';
import PickupOptions from './PickupOptions';
import Totals from './Totals';
import PaymentButtons from './PaymentButtons';
import Confirmation from './Confirmation';
import Header from './Header';

function BookingForm() {
  const { services, loading: servicesLoading } = useServices();
  const slots = usePickupSlots();
  const paymentMethods = usePaymentMethods();

  const [room, setRoom] = useState('');
  const [slot, setSlot] = useState('');
  const [pickup, setPickup] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  
  const { submitOrder, loading: isSubmitting, error, data: orderData } = useOrderSubmission();

  const uniforms = services.filter(s => s.slug && s.slug.includes('uniform'));
  const clothing = services.filter(s => s.slug && !s.slug.includes('uniform'));

  useEffect(() => {
    if (orderData) {
      setConfirmed(true);
      // ✅ The inline style manipulation has been removed from here.
    }
  }, [orderData]);
  
  const handleServiceSelect = (itemToToggle) => {
    setSelectedItems(prevSelectedItems => {
      const isAlreadySelected = prevSelectedItems.some(item => item.id === itemToToggle.id);
      if (isAlreadySelected) {
        return prevSelectedItems.filter(item => item.id !== itemToToggle.id);
      } else {
        return [...prevSelectedItems, itemToToggle];
      }
    });
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
        services: selectedItems.map(item => item.name).join(', '),
      },
    };
    await submitOrder(bookingPayload);
  };

  return (
    <div className="wrap">
      <Header />
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
            <div className="service-category">
              <h3>Uniforms</h3>
              {uniforms.map(item => (
                <ServiceCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.some(i => i.id === item.id)}
                  onSelect={() => handleServiceSelect(item)}
                />
              ))}
            </div>
            <div className="service-category">
              <h3>Other Clothing</h3>
              {clothing.map(item => (
                <ServiceCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.some(i => i.id === item.id)}
                  onSelect={() => handleServiceSelect(item)}
                />
              ))}
            </div>
          </>
        )}

        <div className="grid two mt-6">
          <PickupOptions pickup={pickup} setPickup={setPickup} />
          <div className="grid gap-4">
            <Totals selectedItems={selectedItems} slot={slot} />
            <div className="actions">
              <button type="submit" className="pay-btn alt w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        
        {/* ✅ The 'active' class is now added conditionally based on state */}
        <div className={`confirm ${confirmed ? 'active' : ''}`}>
          <Confirmation orderId={orderData?.id} room={room} slot={slot} pickup={pickup} />
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
