export default function ServiceCard({ item, isSelected, onSelect }) {
  return (
    <label
      className={`card ${isSelected ? "border-blue-500 bg-blue-950" : ""}`}
    >
      <input type="checkbox" checked={isSelected} onChange={onSelect} />
      <div className="media">
        {item.image && <img src={item.image} alt={item.name} />}
      </div>
      <div className="content">
        <h4 className="text-md font-medium text-white">{item.name}</h4>
        <div className="price">৳{item.price}</div>
      </div>
    </label>
  )
}
