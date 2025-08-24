import { useEffect, useState } from "react";

export default function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "https://yourdomain.com/wp-json/wp/v2/service?_embed"
        );
        const data = await res.json();
        const formatted = data.map((item) => ({
          id: item.id,
          name: item.title.rendered,
          price: item.acf?.price || 0,
          image: item.acf?.image?.url || "",
          slug: item.acf?.slug || "",
        }));
        setServices(formatted);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading };
}
