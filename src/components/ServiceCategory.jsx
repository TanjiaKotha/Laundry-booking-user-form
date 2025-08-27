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
          const imageUrl = item.acf?.image?.url || '/images/default-service.png'
          const price = item.acf?.price ?? null
          const unit = item.acf?.unit ?? 'per item'
          const titleText = item.title?.rendered || 'Untitled'

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              className={`card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggle(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleToggle(item)
              }}
            >
              <img
                src={imageUrl}
                alt={titleText}
                className="service-img"
                loading="lazy"
              />
              <h3>{titleText}</h3>
              <p>{price ? `৳${price}` : 'Price not set'}</p>
              <span className="unit">{unit}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ServiceCategory
