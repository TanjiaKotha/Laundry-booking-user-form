// src/hooks/useOrderSubmission.js

import { useState } from 'react';

export default function useOrderSubmission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const submitOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      // ✅ FIX: Dynamically get the auth token instead of using a placeholder.
      // This example uses localStorage, but you should adapt it to your app's auth method.
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('Authentication token not found. Please log in.');
      }

      const response = await fetch('https://amalaundry.com.au/wp-json/wp/v2/laundry_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Use the real token
        },
        body: JSON.stringify({
          title: orderData.title,
          status: 'publish', // It's often better to set to 'publish' to see it in WordPress
          acf: orderData.fields, // Pass the fields object directly to ACF
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`Error ${response.status}: ${errorBody.message || response.statusText}`);
      }

      const responseData = await response.json();
      setData(responseData);
      
    } catch (err) {
      console.error('Order submission failed:', err);
      setError(err.message || 'Could not place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { submitOrder, loading, error, data };
}
