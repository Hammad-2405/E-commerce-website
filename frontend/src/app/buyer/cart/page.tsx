"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch the cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
  }, []);

  const handleRemoveFromCart = (productId: string) => {
    // Filter out the product to be removed
    const updatedCart = cart.filter(product => product._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    router.push('/buyer/cart');
  };

  const handleCheckout = () => {
    router.push('/buyer/checkout'); // Navigate to the checkout page
  };

  return (
    <div className="container mx-auto p-4">
      {/* Navbar */}
      <nav className="bg-black shadow-md mb-4 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl">Shopper</h1>
        </div>
      </nav>

      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      {cart.length > 0 ? (
        <div className="space-y-4">
          {cart.map(product => (
            <div
              key={product._id}
              className="flex items-center justify-between p-4 border rounded shadow-md"
            >
              <div className="flex items-center">
                { <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                /> }
                <div className="ml-4">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="text-lg font-semibold">Price: ${product.price}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromCart(product._id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleCheckout}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded mt-4 w-full text-center text-xl"
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
