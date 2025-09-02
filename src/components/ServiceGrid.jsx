// src/components/ServiceGrid.jsx

import ProductCard from './ProductCard';

function ServiceGrid({ title, items, onAddToCart, selectedItems }) {
  return (
    <section className="service-grid-section">
      <h2>{title}</h2>
      <div className="service-grid">
        {items.map(item => {
          // Check if the current item is already in the cart (selectedItems)
          const isInCart = selectedItems.some(cartItem => cartItem.item.id === item.id);
          return (
            <ProductCard 
              key={item.id} 
              item={item} 
              onAddToCart={onAddToCart}
              isInCart={isInCart}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ServiceGrid;
