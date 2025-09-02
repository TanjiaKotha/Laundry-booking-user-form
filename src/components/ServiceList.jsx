// components/ServiceList.jsx
import useServices from "../hooks/useServices";

export default function ServiceList() {
  const { services, loading } = useServices();

  // Use the same robust logic to correctly identify uniforms
  const otherClothingSlugs = ['underwear', 'sportswear'];
  const uniforms = services.filter(s => s.slug && !otherClothingSlugs.includes(s.slug));

  if (loading) return <p>Loading services...</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {uniforms.map((service) => (
        <div key={service.id} className="border p-4 rounded shadow">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-32 object-cover mb-2"
          />
          <h3 className="text-lg font-semibold">{service.title}</h3>
          <p className="text-sm text-gray-600">Price: ${service.price}</p>
        </div>
      ))}
    </div>
  );
}
