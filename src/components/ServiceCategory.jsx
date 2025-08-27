export default function ServiceCategory({ title, items, selectedItems, setSelectedItems }) {
  const handleToggle = (item) => {
    const exists = selectedItems.find(i => i.id === item.id)
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id))
    } else {
      setSelectedItems([...selectedItems, item])
    }
  }

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => {
          const isSelected = selectedItems.some(i => i.id === item.id)
          return (
            <div
              key={item.id}
              className={`border p-4 rounded cursor-pointer ${isSelected ? 'bg-blue-100' : 'bg-white'}`}
              onClick={() => handleToggle(item)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover mb-2"
              />
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">৳{item.price} per item</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
