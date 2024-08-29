"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CheckoutPage: React.FC = () => {
const { data: session } = useSession();
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch the cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
  }, []);

  const handleCheckout = async () => {
    const buyerUsername = session.user.username; // Assuming you have session available
  
    try {
      const response = await fetch('e-commerce-website-production-ffa9.up.railway.app/api/order/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart, buyerUsername }), // Include buyerUsername
      });
  
      if (response.ok) {
        // Clear the cart and show a success message
        localStorage.removeItem('cart');
        alert('Checkout successful! Your order has been placed.');
        router.push('/buyer/dashboard'); // Redirect to the dashboard after checkout
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="bg-black shadow-md mb-4 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Shopper</h1>
        </div>
      </nav>

      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      {cart.length > 0 ? (
        <div className="space-y-4">
          {cart.map(product => (
            <div
              key={product._id}
              className="flex items-center justify-between p-4 border rounded shadow-md"
            >
              <div className="flex items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="text-lg font-semibold">Price: ${product.price}</p>
                </div>
              </div>
              <p className="text-lg font-semibold">Quantity: 1</p> {/* Adjust quantity if needed */}
            </div>
          ))}
          <button
            onClick={handleCheckout}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded mt-4 w-full text-center text-xl"
          >
            Complete Purchase
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CheckoutPage;
