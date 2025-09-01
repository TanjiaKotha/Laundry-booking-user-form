import { useState } from 'react';

function ServiceItem({ item, quantity, onQuantityChange }) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const handleIncrement = () => {
    const newQuantity = currentQuantity + 1;
    setCurrentQuantity(newQuantity);
    onQuantityChange(item, newQuantity);
  };

  const handleDecrement = () => {
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;
      setCurrentQuantity(newQuantity);
      onQuantityChange(item, newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const newQuantity = isNaN(value) || value < 0 ? 0 : value;
    setCurrentQuantity(newQuantity);
    onQuantityChange(item, newQuantity);
  };

  return (
    <li className="service-item">
      <img
        src={item.image}
        alt={item.name}
        className="service-img"
        loading="lazy"
      />
      <div className="service-info">
        <h4 dangerouslySetInnerHTML={{ __html: item.name }} />
        <p className="price">৳{item.price}</p>
      </div>
      <div className="quantity-control">
        <button type="button" onClick={handleDecrement} disabled={currentQuantity === 0}>-</button>
        <input
          type="number"
          value={currentQuantity}
          onChange={handleInputChange}
          min="0"
        />
        <button type="button" onClick={handleIncrement}>+</button>
      </div>
    </li>
  );
}

export default ServiceItem;
