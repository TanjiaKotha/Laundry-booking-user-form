import { useEffect, useMemo, useState } from 'react'
import useServices from '../hooks/useServices'
import useTimeSlots from '../hooks/useTimeSlots'
import ServiceCategory from './ServiceCategory'

export default function BookingForm() {
  const { services, loading: servicesLoading } = useServices()
  const { slots, loading: slotsLoading, error: slotsError } = useTimeSlots()

  const [roomNumber, setRoomNumber] = useState('')
  const [pickupTime, setPickupTime] = useState('') // dynamic
  const [pickupMethod, setPickupMethod] = useState('outside')
  const [selectedUniforms, setSelectedUniforms] = useState([])
  const [selectedClothing, setSelectedClothing] = useState([])

  // Split services by ACF slug
  const uniforms = useMemo(() => services.filter(s => s.slug === 'uniform'), [services])
  const clothing = useMemo(() => services.filter(s => s.slug === 'other'), [services])

  const selectedItems = useMemo(
    () => [...selectedUniforms, ...selectedClothing],
    [selectedUniforms, selectedClothing]
  )
  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0),
    [selectedItems]
  )

  // Pick first available slot as default
  useEffect(() => {
    if (!pickupTime && !slotsLoading && slots.length > 0) {
      setPickupTime(slots[0].value)
    }
  }, [slotsLoading, slots, pickupTime])

  const handleSubmit = () => {
    if (!roomNumber) return alert('Please enter your room number.')
    if (!pickupTime) return alert('Please select a pickup time slot.')
    if (selectedItems.length === 0) return alert('Please select at least one item.')

    const payload = {
      roomNumber,
      pickupTime,
      pickupMethod,
      items: selectedItems.map(i => ({ id: i.id, name: i.name, price: i.price })),
      totalPrice,
    }
    console.log('Booking submitted:', payload)
    // TODO: POST to backend
  }

  const handlePayment = (method) => {
    if (!pickupTime) return alert('Please select a pickup time slot first.')
    alert(`Redirecting to ${method} payment gateway...`)
    // TODO: Integrate gateway
  }

  const loading = servicesLoading || slotsLoading
  const noServices = !servicesLoading && services.length === 0

  if (loading) return <p>Loading...</p>
  if (noServices) return <p className="text-red-500">No services available. Please check back later.</p>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Laundry Booking</h1>

      {/* Room Number */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Room Number</label>
        <input
          type="text"
          value={roomNumber}
          onChange={e => setRoomNumber(e.target.value)}
          placeholder="Enter room number"
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* Pickup Time Slot (Dynamic) */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Pickup Time Slot</label>
        <select
          value={pickupTime}
          onChange={e => setPickupTime(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          disabled={slotsLoading || slots.length === 0}
        >
          {slots.map(s => (
            <option key={s.id ?? s.value} value={s.value}>
              {s.label || s.value}
            </option>
          ))}
        </select>
        {slotsError && <p className="text-red-600 mt-1">{slotsError}</p>}
      </div>

      {/* Service Selection */}
      <ServiceCategory
        title="VIP Item"
        items={uniforms}
        selectedItems={selectedUniforms}
        setSelectedItems={setSelectedUniforms}
      />

      <ServiceCategory
        title="Other Clothing"
        items={clothing}
        selectedItems={selectedClothing}
        setSelectedItems={setSelectedClothing}
      />

      {/* Pickup Method */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Pickup Method</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              value="inside"
              checked={pickupMethod === 'inside'}
              onChange={e => setPickupMethod(e.target.value)}
            />
            <span className="ml-2">Pickup inside the room</span>
          </label>
          <label>
            <input
              type="radio"
              value="outside"
              checked={pickupMethod === 'outside'}
              onChange={e => setPickupMethod(e.target.value)}
            />
            <span className="ml-2">Pickup outside, in front of the door</span>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <p className="font-semibold">Selected Service Name: Room Service {totalPrice}</p>
        <p className="font-semibold">Total Price: ৳{totalPrice}</p>
      </div>

      {/* Payment Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <button onClick={() => handlePayment('Stripe')} className="bg-purple-600 text-white px-4 py-2 rounded">Pay with Stripe</button>
        <button onClick={() => handlePayment('Square')} className="bg-gray-800 text-white px-4 py-2 rounded">Pay with Square</button>
        <button onClick={() => handlePayment('PayPal')} className="bg-yellow-500 text-white px-4 py-2 rounded">Pay with PayPal</button>
       
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Booking
      </button>
    </div>
  )
}
