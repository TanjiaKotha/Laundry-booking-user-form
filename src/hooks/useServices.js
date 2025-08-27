import { useEffect, useState } from 'react'

export default function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://amalaundry.com.au/wp-json/wp/v2/service?_embed')
      .then(res => res.json())
      .then(data => {
        const parsed = data.map(item => ({
          id: item.id,
          name: item.title?.rendered || 'Unnamed',
          price: item.acf?.price ?? 0,
          slug: item.acf?.slug || '',
          image:
            typeof item.acf?.image === 'object' && item.acf.image?.url
              ? item.acf.image.url
              : '/images/default-service.png',
        }))
        setServices(parsed)
        setLoading(false)
      })
      .catch(err => {
        console.error('Service fetch failed:', err)
        setLoading(false)
      })
  }, [])

  return { services, loading }
}
