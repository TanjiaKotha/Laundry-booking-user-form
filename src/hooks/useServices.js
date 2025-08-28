import { useEffect, useState } from 'react'

export default function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://amalaundry.com.au/wp-json/wp/v2/service?_embed')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          id: item.id,
          name: item.title.rendered,
          price: item.acf?.price || 0,
          slug: item.acf?.slug || '',
          image: item.acf?.image?.url || '/images/default-service.png',
        }))
        setServices(formatted)
        setLoading(false)
      })
      .catch(err => {
        console.error('Service fetch failed:', err)
        setLoading(false)
      })
  }, [])

  return { services, loading }
}
