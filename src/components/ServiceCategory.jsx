import ServiceCard from "./ServiceCard";

export default function ServiceCategory({
  title,
  items,
  selectedItems,
  setSelectedItems,
}) {
  const toggleSelect = (item) => {
    const exists = selectedItems.some((i) => i.id === item.id);
    setSelectedItems(
      exists
        ? selectedItems.filter((i) => i.id !== item.id)
        : [...selectedItems, item]
    );
  };

  return (
    <div className="service-category">
      <h3>{title}</h3>
      {items.map((item) => (
        <ServiceCard
          key={item.id}
          item={item}
          isSelected={selectedItems.some((i) => i.id === item.id)}
          onSelect={() => toggleSelect(item)}
        />
      ))}
    </div>
  );
}
