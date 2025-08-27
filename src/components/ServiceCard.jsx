export default function ServiceCard({ item, isSelected, onSelect }) {
  const imageUrl = item.image || '/images/default-service.png'
  const name = item.name || 'Unnamed Service'
  const price = item.price ?? null

  return (
    <label className={`card ${isSelected ? 'border-blue-500 bg-blue-950' : ''}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="hidden"
      />
      <div className="media">
        <img src={imageUrl} alt={name} className="service-img" loading="lazy" />
      </div>
      <div className="content">
        <h4 className="text-md font-medium text-white">{name}</h4>
        <div className="price">{price ? `৳${price}` : 'Price not set'}</div>
      </div>
      {isSelected && <div className="selected-badge">✓</div>}
    </label>
  )
}
