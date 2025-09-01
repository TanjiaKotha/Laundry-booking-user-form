import { useEffect, useState } from 'react'

export default function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://amalaundry.com.au/wp-json/wp/v2/service?_embed')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()

        const formattedPromises = data.map(async item => {
          let imageUrl = '/images/default-service.png' // Fallback image

          if (item.acf?.image) {
            try {
              const mediaResponse = await fetch(`https://amalaundry.com.au/wp-json/wp/v2/media/${item.acf.image}`)
              if (mediaResponse.ok) {
                const mediaData = await mediaResponse.json()
                // Use the full URL from the media data
                imageUrl = mediaData.source_url || imageUrl
              }
            } catch (mediaError) {
              console.error('Failed to fetch media:', mediaError)
            }
          }

          return {
            id: item.id,
            name: item.title.rendered,
            price: item.acf?.price || 0,
            slug: item.acf?.slug || '',
            image: imageUrl, // Now contains the correct URL
          }
        })

        const formattedServices = await Promise.all(formattedPromises)
        setServices(formattedServices)
        setLoading(false)
      } catch (error) {
        console.error('Service fetch failed:', error)
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading }
}
