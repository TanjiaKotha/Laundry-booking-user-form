export default function ServiceCategory({ title, items, selectedItems, setSelectedItems }) {
  const toggleItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id)
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id))
    } else {
      setSelectedItems([...selectedItems, item])
    }
  }

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => {
          const isSelected = selectedItems.some(i => i.id === item.id)
          return (
            <div
              key={item.id}
              className={`border rounded p-3 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
              onClick={() => toggleItem(item)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover mb-2"
              />
              <h3 className="font-medium">{item.name}</h3>
              <p>৳{item.price}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
