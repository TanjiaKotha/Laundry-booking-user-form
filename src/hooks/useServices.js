// src/hooks/useServices.js

import { useEffect, useState } from 'react';

export default function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://amalaundry.com.au/wp-json/wp/v2/service');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const formattedServices = data.map(item => ({
          id: item.id,
          name: item.title.rendered,
          price: item.acf?.price || 0,
          slug: item.slug || '',
          // ✅ Directly use the image URL from the ACF field now!
          image: item.acf?.image || '/images/default-service.png',
        }));

        setServices(formattedServices);

      } catch (error) {
        console.error('Service fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading };
}
