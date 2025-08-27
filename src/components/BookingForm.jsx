import { useState } from 'react'
import useServices from '../hooks/useServices'
import usePickupSlots from '../hooks/usePickupSlots'
import usePaymentMethods from '../hooks/usePaymentMethods'
import ServiceCategory from './ServiceCategory'
import PickupOptions from './PickupOptions'
import Totals from './Totals'
import PaymentButtons from './PaymentButtons'
import Confirmation from './Confirmation'

function BookingForm() {
  const { services, loading } = useServices()
  const slots = usePickupSlots()
  const paymentMethods = usePaymentMethods()

  const [room, setRoom] = useState('')
  const [slot, setSlot] = useState('')
  const [pickup, setPickup] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const [orderId, setOrderId] = useState('')

  // Defensive filtering
  const uniforms = services.filter(
    s => typeof s.slug === 'string' && s.slug.toLowerCase().includes('uniform')
  )
  const clothing = services.filter(
    s => typeof s.slug === 'string' && !s.slug.toLowerCase().includes('uniform')
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!room || !slot || !pickup || selectedItems.length === 0) {
      alert('Please complete all fields and select at least one service.')
      return
    }

    const id = 'AMA-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    setOrderId(id)
    setConfirmed(true)

    // Optional: POST to backend
    // fetch('/wp-json/booking/v1/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ room, slot, pickup, selectedItems, orderId: id })
    // }).then(res => res.json()).then(data => {
    //   console.log('Booking confirmed:', data)
    // }).catch(err => {
    //   console.error('Booking failed:', err)
    // })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <button type="submit" className="pay-btn">Submit Booking</button>
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
  )
}

export default BookingForm
