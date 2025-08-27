import { useEffect, useState } from 'react'

function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/wp-json/wp/v2/services?acf_format=standard')
      .then(res => res.json())
      .then(data => {
        console.log('Raw service data:', data)

        const parsed = data.map(item => ({
          id: item.id,
          title: item.title?.rendered || '',
          slug: item.slug || '', // WP post slug
          acfSlug: item.acf?.slug || '', // ACF slug for filtering
          price: item.acf?.price ?? 0,
          description: item.acf?.description ?? '',
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

export default useServices
