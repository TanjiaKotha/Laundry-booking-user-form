// src/components/ProductCard.jsx

import { useState } from 'react';

function ProductCard({ item, onAddToCart, isInCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCartClick = () => {
    onAddToCart(item, quantity);
  };

  // Add a 'selected' class if the item is in the cart to create the purple border
  const cardClassName = `product-card ${isInCart ? 'selected' : ''}`;

  return (
    <div className={cardClassName}>
      <div className="product-card-image">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <div className="product-card-content">
        <h4 className="product-title">{item.name}</h4>
        <p className="product-price">Price: ৳{item.price}</p>
        <div className="product-card-actions">
          <div className="quantity-control">
            <button type="button" onClick={handleDecrement}>-</button>
            <input type="number" value={quantity} readOnly min="1" />
            <button type="button" onClick={handleIncrement}>+</button>
          </div>
          <button type="button" className="add-to-cart-btn" onClick={handleAddToCartClick}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
