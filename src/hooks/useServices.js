// hooks/useServices.js
import { useEffect, useState } from 'react'

export default function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('https://laundry-booking-user-form.vercel.app/wp-json/wp/v2/service?_embed')
        const data = await res.json()

        const mapped = data.map(item => ({
          id: item.id,
          title: item.title.rendered,
          price: item.acf?.price,
          slug: item.acf?.slug,
          image: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
        }))

        setServices(mapped)
      } catch (err) {
        console.error('Failed to fetch services:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading }
}
