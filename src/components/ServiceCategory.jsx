import ServiceCard from './ServiceCard'

function ServiceCategory({ title, items, selectedItems, setSelectedItems }) {
  const handleToggle = (item) => {
    const exists = selectedItems.find(i => i.id === item.id)
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id))
    } else {
      setSelectedItems([...selectedItems, item])
    }
  }

  return (
    <section className="category">
      <h2>{title}</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(item => {
          const isSelected = selectedItems.some(i => i.id === item.id)
          return (
            <ServiceCard
              key={item.id}
              item={item}
              isSelected={isSelected}
              onSelect={() => handleToggle(item)}
            />
          )
        })}
      </div>
    </section>
  )
}

export default ServiceCategory
