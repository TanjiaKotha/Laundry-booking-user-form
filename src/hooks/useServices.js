import { useEffect, useState } from 'react'

function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://amalaundry.com.au/wp-json/wp/v2/service?_embed')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch services')
        return res.json()
      })
      .then(data => {
        setServices(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching services:', err)
        setLoading(false)
      })
  }, [])

  return { services, loading }
}

export default useServices
