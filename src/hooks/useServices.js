import { useEffect, useState } from 'react'

export default function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // The '?_embed' is crucial. It includes linked data like featured images.
        const response = await fetch('https://amalaundry.com.au/wp-json/wp/v2/service?_embed')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()

        // --- ✅ FIX: Simplified and optimized image URL retrieval. No more extra fetches! ---
        const formattedServices = data.map(item => {
          // Safely access the embedded featured media URL
          const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
          const imageUrl = featuredMedia?.source_url || '/images/default-service.png'; // Fallback image

          return {
            id: item.id,
            name: item.title.rendered,
            price: item.acf?.price || 0,
            slug: item.slug || '', // The post slug is on the root item, not ACF
            image: imageUrl,
          }
        })

        setServices(formattedServices)
      } catch (error) {
        console.error('Service fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading }
}
