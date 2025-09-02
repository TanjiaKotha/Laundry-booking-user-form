import { useState, useEffect } from 'react';
import useServices from '../hooks/useServices';
import usePickupSlots from '../hooks/usePickupSlots';
import usePaymentMethods from '../hooks/usePaymentMethods';
import useOrderSubmission from '../hooks/useOrderSubmission';
import ServiceCategory from './ServiceCategory';
import PickupOptions from './PickupOptions';
import Totals from './Totals';
import PaymentButtons from './PaymentButtons';
import Confirmation from './Confirmation';

function BookingForm() {
  const { services, loading: servicesLoading } = useServices();
  const slots = usePickupSlots();
  const paymentMethods = usePaymentMethods();

  const [room, setRoom] = useState('');
  const [slot, setSlot] = useState('');
  const [pickup, setPickup] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  
  // Use the new custom hook to handle submission logic
  const { submitOrder, loading: isSubmitting, error, data: orderData } = useOrderSubmission();

  const uniforms = services.filter(s => s.slug.includes('uniform'));
  const clothing = services.filter(s => !s.slug.includes('uniform'));
  
  // Use a useEffect to handle the response from the API call
  useEffect(() => {
    if (orderData) {
      setConfirmed(true);
    }
  }, [orderData]);

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

    // Call the new hook's function to handle the API submission
    await submitOrder(bookingPayload);
  };

  if (confirmed) {
    return (
      <Confirmation
        orderId={orderData.id}
        room={room}
        slot={slot}
        pickup={pickup}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-row">
        <div className="field">
          <label htmlFor="room">Room Number *</label>
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
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

      {servicesLoading ? (
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
