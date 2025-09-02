// src/hooks/useOrderSubmission.js

import { useState } from 'react';

export default function useOrderSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // ✅ FIX: Pointing to your custom, authentication-free endpoint from ama-laundry.php
      const response = await fetch('https://amalaundry.com.au/wp-json/ama-laundry/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No 'Authorization' header is needed anymore!
        },
        // The custom endpoint is designed to accept the 'fields' object directly.
        body: JSON.stringify(orderData.fields),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Error ${response.status}: ${errorBody.message || 'The server returned an error.'}`);
      }

      const responseData = await response.json();
      
      // ✅ FIX: The custom endpoint returns { order_id: ... }. We'll map it to the { id: ... } format
      // that the Confirmation component expects.
      setData({ id: responseData.order_id });
      
    } catch (err) {
      console.error('Order submission failed:', err);
      setError(err.message || 'Could not place your order. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error, data };
}
