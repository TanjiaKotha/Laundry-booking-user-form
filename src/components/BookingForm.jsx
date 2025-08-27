import { useState } from 'react'
import useServices from '../hooks/useServices'
import ServiceCategory from './ServiceCategory'

export default function BookingForm() {
  const { services, loading } = useServices()
  const [selectedUniforms, setSelectedUniforms] = useState([])
  const [selectedClothing, setSelectedClothing] = useState([])
  const [pickupMethod, setPickupMethod] = useState('outside')

  const uniforms = services.filter(s => s.slug === 'uniform')
  const clothing = services.filter(s => s.slug === 'other')

  const totalPrice = [...selectedUniforms, ...selectedClothing].reduce(
    (sum, item) => sum + item.price,
    0
  )

  const handleSubmit = () => {
    if (!services.length) {
      alert('No services available. Please check back later.')
      return
    }

    const payload = {
      uniforms: selectedUniforms.map(i => i.id),
      clothing: selectedClothing.map(i => i.id),
      pickupMethod,
      totalPrice,
    }

    console.log('Submitting booking:', payload)
    // TODO: POST to backend
  }

  if (loading) return <p>Loading services...</p>
  if (!services.length) return <p className="text-red-500">No services available. Please check back later.</p>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Laundry Booking</h1>

      <ServiceCategory
        title="Uniforms"
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

      <div className="mb-4">
        <label className="block font-medium mb-1">Pickup Method</label>
        <select
          value={pickupMethod}
          onChange={e => setPickupMethod(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="inside">Pickup inside the room</option>
          <option value="outside">Pickup outside, in front of the door</option>
        </select>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Total Price: ৳{totalPrice}</p>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Booking
      </button>
    </div>
  )
}
