// src/hooks/useServices.js

import { useEffect, useState } from 'react';

// The base URL for your WordPress site
const WP_BASE_URL = 'https://amalaundry.com.au';

export default function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesAndImages = async () => {
      setLoading(true);
      try {
        // 1. Fetch the initial list of services
        const servicesResponse = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/service`);
        if (!servicesResponse.ok) {
          throw new Error('Network response for services was not ok');
        }
        const servicesData = await servicesResponse.json();

        // 2. ✅ NEW: Create an array of promises to fetch the media details for each image ID
        const imagePromises = servicesData.map(item => {
          // If there's an image ID in the ACF field, fetch its details
          if (item.acf?.image) {
            return fetch(`${WP_BASE_URL}/wp-json/wp/v2/media/${item.acf.image}`)
              .then(res => {
                if (!res.ok) {
                  // If a single image fails, log error but don't crash the whole process
                  console.error(`Failed to fetch image ID: ${item.acf.image}`);
                  return null; // Return null for failed requests
                }
                return res.json();
              })
              .then(mediaData => {
                 // If the fetch was successful, get the full URL from the response
                return mediaData?.source_url || '/images/default-service.png';
              });
          }
          // If there's no image ID, use a default placeholder
          return Promise.resolve('/images/default-service.png');
        });

        // 3. ✅ NEW: Wait for all the image fetches to complete
        const imageUrls = await Promise.all(imagePromises);

        // 4. ✅ NEW: Combine the original service data with the new image URLs
        const formattedServices = servicesData.map((item, index) => ({
          id: item.id,
          name: item.title.rendered,
          price: item.acf?.price || 0,
          // ✅ FIX: Use the custom slug from the ACF field (item.acf.slug)
          slug: item.acf?.slug || '',
          image: imageUrls[index], // Use the fetched image URL
        }));
        
        setServices(formattedServices);

      } catch (error) {
        console.error('Service or Image fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesAndImages();
  }, []);

  return { services, loading };
}
