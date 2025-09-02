import { useState } from 'react';

export default function useOrderSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://amalaundry.com.au/wp-json/wp/v2/laundry_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_JWT_TOKEN`, // ⚠️ Replace with your actual token
        },
        body: JSON.stringify({
          title: orderData.title,
          status: orderData.status,
          acf: {
            laundry_order: orderData.fields,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      setData(responseData);
      
    } catch (err) {
      console.error('Order submission failed:', err);
      setError('Could not place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error, data };
}
