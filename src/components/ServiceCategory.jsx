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

          // ✅ Use ACF image URL or fallback
          const imageUrl =
            item.acf?.image?.url || '/images/default-service.png'

          return (
            <div
              key={item.id}
              className={`card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleToggle(item)}
            >
              <img
                src={imageUrl}
                alt={item.title.rendered}
                className="service-img"
                loading="lazy"
              />
              <h3 dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
              <p>{item.acf?.price ? `৳${item.acf.price}` : 'Price not set'}</p>
              <span className="unit">{item.acf?.unit || 'per item'}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ServiceCategory
