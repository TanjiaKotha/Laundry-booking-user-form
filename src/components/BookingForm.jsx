import { useState } from 'react'
import useServices from '../hooks/useServices'
import ServiceCategory from './ServiceCategory'

export default function BookingForm() {
  const { services, loading } = useServices()
  const [roomNumber, setRoomNumber] = useState('')
  const [pickupTime, setPickupTime] = useState('08:00')
  const [pickupMethod, setPickupMethod] = useState('outside')
  const [selectedUniforms, setSelectedUniforms] = useState([])
  const [selectedClothing, setSelectedClothing] = useState([])

  const uniforms = services.filter(s => s.slug === 'uniform')
  const clothing = services.filter(s => s.slug === 'other')
  const selectedItems = [...selectedUniforms, ...selectedClothing]
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0)

  const handleSubmit = () => {
    if (!roomNumber || !pickupTime || selectedItems.length === 0) {
      alert('Please complete all fields and select at least one item.')
      return
    }

    const payload = {
      roomNumber,
      pickupTime,
      pickupMethod,
      items: selectedItems.map(i => ({ id: i.id, name: i.name, price: i.price })),
      totalPrice,
    }

    console.log('Booking submitted:', payload)
    // TODO: POST to backend or trigger payment
  }

  const handlePayment = (method) => {
    alert(`Redirecting to ${method} payment gateway...`)
    // TODO: Integrate actual payment logic
  }

  if (loading) return <p>Loading services...</p>
  if (!services.length) return <p className="text-red-500">No services available. Please check back later.</p>

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

      {/* Pickup Time Slot */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Pickup Time Slot</label>
        <select
          value={pickupTime}
          onChange={e => setPickupTime(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="08:00">08:00</option>
          <option value="10:00">10:00</option>
          <option value="14:00">14:00</option>
          <option value="18:00">18:00</option>
        </select>
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
        <button onClick={() => handlePayment('Razor')} className="bg-green-600 text-white px-4 py-2 rounded">Pay with Razor</button>
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
